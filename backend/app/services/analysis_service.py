from numbers import Real
from typing import Any

import pandas as pd

from app.models.schemas import AnalysisPlan, AnalyzeResponse, ChartConfig
from app.utils.dataframe_helpers import coerce_json_records
from app.utils.file_store import load_dataframe


def _validate_plan(plan: AnalysisPlan, dataframe: pd.DataFrame) -> None:
    columns = set(dataframe.columns)
    requested = [plan.x_column, plan.y_column, plan.group_by]
    if plan.filter:
        requested.append(plan.filter.column)

    missing = [column for column in requested if column and column not in columns]
    if missing:
        raise ValueError("DataLens could not match one or more columns for that question.")

    if plan.operation != "count" and not plan.y_column:
        raise ValueError("A numeric column is required for this question.")
    if plan.y_column and plan.operation != "count" and not pd.api.types.is_numeric_dtype(dataframe[plan.y_column]):
        raise ValueError(f"Column '{plan.y_column}' is not numeric, so it cannot be aggregated.")
    if plan.filter and plan.filter.operator not in ("=", "!="):
        series = dataframe[plan.filter.column]
        if not pd.api.types.is_numeric_dtype(series) and not pd.api.types.is_datetime64_any_dtype(series):
            raise ValueError(f"Filter '{plan.filter.operator}' requires a numeric or date column.")


def _coerce_filter_value(series: pd.Series, value: Any) -> Any:
    if value is None:
        return None
    if pd.api.types.is_numeric_dtype(series):
        coerced = pd.to_numeric(pd.Series([value]), errors="coerce").iloc[0]
        if pd.isna(coerced):
            raise ValueError("Filter value must be numeric for this column.")
        return coerced
    if pd.api.types.is_datetime64_any_dtype(series):
        coerced = pd.to_datetime(value, errors="coerce")
        if pd.isna(coerced):
            raise ValueError("Filter value must be a valid date for this column.")
        return coerced
    return str(value).strip().casefold()


def _apply_filter(dataframe: pd.DataFrame, plan: AnalysisPlan) -> pd.DataFrame:
    if not plan.filter:
        return dataframe

    condition = plan.filter
    series = dataframe[condition.column]
    value = _coerce_filter_value(series, condition.value)

    if condition.operator == "=":
        mask = series == value if not isinstance(value, str) else series.astype(str).str.strip().str.casefold() == value
    elif condition.operator == "!=":
        mask = series != value if not isinstance(value, str) else series.astype(str).str.strip().str.casefold() != value
    elif condition.operator == ">":
        mask = series > value
    elif condition.operator == "<":
        mask = series < value
    elif condition.operator == ">=":
        mask = series >= value
    elif condition.operator == "<=":
        mask = series <= value
    else:
        raise ValueError("Unsupported filter operator.")

    return dataframe[mask]


def _prepare_group_column(dataframe: pd.DataFrame, column: str, intent: str) -> tuple[pd.DataFrame, str]:
    df = dataframe.copy()
    if pd.api.types.is_datetime64_any_dtype(df[column]):
        output_column = "month" if intent == "trend" else column
        df[output_column] = df[column].dt.to_period("M").astype(str)
        return df, output_column
    return df, column


def _aggregate(dataframe: pd.DataFrame, plan: AnalysisPlan) -> tuple[pd.DataFrame, str, str]:
    group_column = plan.group_by or plan.x_column
    df, output_x = _prepare_group_column(dataframe, group_column, plan.intent)
    output_y = "count" if plan.operation == "count" else f"{plan.operation}_{plan.y_column}"

    if plan.operation == "count":
        result = df.groupby(output_x, dropna=False).size().reset_index(name=output_y)
    else:
        aggregation = "mean" if plan.operation == "avg" else plan.operation
        result = (
            df.groupby(output_x, dropna=False)[plan.y_column]
            .agg(aggregation)
            .reset_index(name=output_y)
        )

    result = result.dropna(subset=[output_y])
    if result.empty:
        raise ValueError("No numeric values were available for the requested analysis.")

    if plan.intent == "trend":
        result = result.sort_values(output_x, ascending=True)
    elif plan.operation == "min":
        result = result.sort_values(output_y, ascending=True)
    else:
        result = result.sort_values(output_y, ascending=False)

    return result.head(plan.limit), output_x, output_y


def _format_value(value: Any) -> str:
    if isinstance(value, Real) and not isinstance(value, bool):
        return f"{value:,.2f}".rstrip("0").rstrip(".")
    return str(value)


def _answer_text(question: str, result: pd.DataFrame, x_key: str, y_key: str, plan: AnalysisPlan) -> str:
    if result.empty:
        return "No matching rows were found for that question."

    top_row = result.iloc[0]
    metric_name = "records" if plan.operation == "count" else plan.y_column
    if plan.intent == "trend":
        peak_row = result.sort_values(y_key, ascending=False).iloc[0]
        return f"{peak_row[x_key]} has the highest {metric_name} at {_format_value(peak_row[y_key])}."
    if plan.operation == "min":
        return f"{top_row[x_key]} has the lowest {metric_name} at {_format_value(top_row[y_key])}."
    return f"{top_row[x_key]} leads with {_format_value(top_row[y_key])} {metric_name}."


def _insights(result: pd.DataFrame, x_key: str, y_key: str, plan: AnalysisPlan) -> list[str]:
    if result.empty:
        return ["No rows matched the selected analysis plan."]

    insights = []
    ascending = plan.operation == "min"
    top = result.sort_values(y_key, ascending=ascending).iloc[0]
    label = "lowest segment" if ascending else "strongest segment"
    insights.append(f"{top[x_key]} is the {label} with {_format_value(top[y_key])}.")

    if len(result) > 1:
        second = result.sort_values(y_key, ascending=ascending).iloc[1]
        diff = abs(top[y_key] - second[y_key])
        insights.append(f"The gap to {second[x_key]} is {_format_value(diff)}.")

    total = result[y_key].sum()
    if total:
        share = top[y_key] / total * 100
        insights.append(f"{top[x_key]} represents {share:.1f}% of the displayed result.")

    if plan.intent == "trend" and len(result) > 1:
        first = result.iloc[0][y_key]
        last = result.iloc[-1][y_key]
        direction = "up" if last >= first else "down"
        insights.append(f"The trend ends {direction} from {_format_value(first)} to {_format_value(last)}.")

    return insights[:4]


def _chart_title(plan: AnalysisPlan, x_key: str, y_key: str) -> str:
    metric = "Record count" if plan.operation == "count" else f"{plan.operation.title()} of {plan.y_column}"
    return f"{metric} by {x_key}"


def run_analysis(dataset_id: str, question: str, plan: AnalysisPlan) -> AnalyzeResponse:
    dataframe = load_dataframe(dataset_id)
    _validate_plan(plan, dataframe)
    filtered = _apply_filter(dataframe, plan)
    if filtered.empty:
        raise ValueError("No rows match the requested filter.")

    result, x_key, y_key = _aggregate(filtered, plan)
    records = coerce_json_records(result)

    return AnalyzeResponse(
        answer=_answer_text(question, result, x_key, y_key, plan),
        chart=ChartConfig(
            type=plan.chart_type,
            title=_chart_title(plan, x_key, y_key),
            xKey=x_key,
            yKey=y_key,
            data=records,
        ),
        insights=_insights(result, x_key, y_key, plan),
        table=records,
    )
