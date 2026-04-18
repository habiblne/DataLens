from typing import Any
import math

import pandas as pd

from app.models.schemas import DatasetSummary


def _looks_like_datetime(column: str, series: pd.Series) -> bool:
    name = column.lower()
    if any(token in name for token in ["date", "time", "month", "year"]):
        return True

    sample = series.dropna().astype(str).head(25)
    if sample.empty:
        return False
    date_like_count = sample.str.contains(r"[-/:]", regex=True).sum()
    return date_like_count / len(sample) >= 0.75


def clean_dataframe(dataframe: pd.DataFrame) -> pd.DataFrame:
    df = dataframe.copy()
    df = df.dropna(how="all").dropna(axis=1, how="all")
    df.columns = [
        str(column).strip() if str(column).strip() else f"column_{index + 1}"
        for index, column in enumerate(df.columns)
    ]
    df = df.loc[:, ~df.columns.duplicated()]

    for column in df.columns:
        if df[column].dtype == "object" and _looks_like_datetime(column, df[column]):
            converted = pd.to_datetime(df[column], errors="coerce")
            valid_ratio = converted.notna().mean() if len(converted) else 0
            if valid_ratio >= 0.75:
                df[column] = converted

    return df


def summarize_dataframe(dataframe: pd.DataFrame) -> DatasetSummary:
    numeric_columns = dataframe.select_dtypes(include="number").columns.tolist()
    datetime_columns = dataframe.select_dtypes(include=["datetime64[ns]", "datetimetz"]).columns.tolist()
    categorical_columns = [
        column
        for column in dataframe.columns
        if column not in numeric_columns and column not in datetime_columns
    ]

    return DatasetSummary(
        numeric_columns=numeric_columns,
        categorical_columns=categorical_columns,
        datetime_columns=datetime_columns,
        missing_values={column: int(count) for column, count in dataframe.isna().sum().items()},
    )


def dataframe_preview(dataframe: pd.DataFrame, rows: int = 10) -> list[dict[str, Any]]:
    preview = dataframe.head(rows).copy()
    for column in preview.select_dtypes(include=["datetime64[ns]", "datetimetz"]).columns:
        preview[column] = preview[column].dt.strftime("%Y-%m-%d")
    return _json_safe_records(preview)


def dtype_map(dataframe: pd.DataFrame) -> dict[str, str]:
    return {column: str(dtype) for column, dtype in dataframe.dtypes.items()}


def coerce_json_records(dataframe: pd.DataFrame) -> list[dict[str, Any]]:
    output = dataframe.copy()
    for column in output.select_dtypes(include=["datetime64[ns]", "datetimetz"]).columns:
        output[column] = output[column].dt.strftime("%Y-%m-%d")
    return _json_safe_records(output)


def _json_safe_records(dataframe: pd.DataFrame) -> list[dict[str, Any]]:
    safe = dataframe.astype(object).where(pd.notnull(dataframe), None)
    records = safe.to_dict(orient="records")
    for record in records:
        for key, value in record.items():
            if isinstance(value, float) and not math.isfinite(value):
                record[key] = None
    return records
