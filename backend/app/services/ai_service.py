import json
import os
import re
from typing import Any

from openai import AsyncOpenAI
from pydantic import ValidationError

from app.models.schemas import AnalysisPlan
from app.utils.dataframe_helpers import dataframe_preview, dtype_map, summarize_dataframe
from app.utils.file_store import load_dataframe


def _normalise_for_matching(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", value.lower())


def _tokens_for_matching(value: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+", value.lower().replace("_", " ")))


def _column_matches(question: str, columns: list[str]) -> list[str]:
    normalised_question = _normalise_for_matching(question)
    question_tokens = _tokens_for_matching(question)
    matches = []
    for column in columns:
        column_tokens = _tokens_for_matching(column)
        if _normalise_for_matching(column) in normalised_question or column_tokens.issubset(question_tokens):
            matches.append(column)
    return matches


def _mentioned_dimension_columns(question: str, columns: list[str], dtypes: dict[str, str]) -> list[str]:
    dimension_columns = [
        column
        for column in columns
        if not any(token in dtypes[column] for token in ["int", "float", "datetime"])
    ]
    return _column_matches(question, dimension_columns)


def _correct_explicit_dimension(plan: AnalysisPlan, question: str, columns: list[str], dtypes: dict[str, str]) -> AnalysisPlan:
    mentioned_dimensions = _mentioned_dimension_columns(question, columns, dtypes)
    if len(mentioned_dimensions) != 1:
        return plan

    dimension = mentioned_dimensions[0]
    if plan.group_by == dimension and plan.x_column == dimension:
        return plan

    return plan.model_copy(update={"x_column": dimension, "group_by": dimension})


def _fallback_plan(question: str, columns: list[str], dtypes: dict[str, str]) -> AnalysisPlan:
    lower_question = question.lower()
    numeric_columns = [column for column in columns if any(token in dtypes[column] for token in ["int", "float"])]
    datetime_columns = [column for column in columns if "datetime" in dtypes[column]]
    categorical_columns = [
        column for column in columns if column not in numeric_columns and column not in datetime_columns
    ]

    y_column = next((column for column in numeric_columns if column in _column_matches(question, numeric_columns)), None)
    y_column = y_column or (numeric_columns[0] if numeric_columns else None)
    operation = "count"
    if y_column:
        if any(token in lower_question for token in ["average", "avg", "mean"]):
            operation = "avg"
        elif any(token in lower_question for token in ["lowest", "minimum", "min", "underperform"]):
            operation = "min"
        elif any(token in lower_question for token in ["highest", "maximum", "max", "peak"]):
            operation = "max"
        else:
            operation = "sum"

    mentioned_dimensions = _mentioned_dimension_columns(question, columns, dtypes)
    if "trend" in lower_question or "over time" in lower_question or "month" in lower_question:
        x_column = datetime_columns[0] if datetime_columns else columns[0]
        chart_type = "line"
        intent = "trend"
    elif "distribution" in lower_question or "share" in lower_question or "percent" in lower_question:
        x_column = (
            mentioned_dimensions[0]
            if len(mentioned_dimensions) == 1
            else categorical_columns[0] if categorical_columns else columns[0]
        )
        chart_type = "pie"
        intent = "distribution"
    else:
        x_column = (
            mentioned_dimensions[0]
            if len(mentioned_dimensions) == 1
            else categorical_columns[0] if categorical_columns else columns[0]
        )
        chart_type = "bar"
        intent = "comparison"

    return AnalysisPlan(
        intent=intent,
        x_column=x_column,
        y_column=y_column,
        operation=operation,
        group_by=x_column,
        filter=None,
        chart_type=chart_type,
        limit=10,
    )


async def build_analysis_plan(dataset_id: str, question: str) -> AnalysisPlan:
    dataframe = load_dataframe(dataset_id)
    columns = dataframe.columns.tolist()
    dtypes = dtype_map(dataframe)

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return _fallback_plan(question, columns, dtypes)

    summary = summarize_dataframe(dataframe)
    system_prompt = (
        "You are DataLens, a safe data analysis planner. Return only JSON that matches the requested schema. "
        "Never return Python code. Use only column names that exist in the dataset. Prefer simple plans."
    )
    schema_hint: dict[str, Any] = {
        "intent": "aggregate | trend | comparison | distribution",
        "x_column": "existing column name",
        "y_column": "existing numeric column name or null for count",
        "operation": "sum | avg | count | max | min",
        "group_by": "existing column name or null",
        "filter": {"column": "existing column", "operator": "= | != | > | < | >= | <=", "value": "value"},
        "chart_type": "bar | line | pie | area",
        "limit": 10,
    }
    user_prompt = {
        "question": question,
        "columns": columns,
        "dtypes": dtypes,
        "summary": summary.model_dump(),
        "sample_rows": dataframe_preview(dataframe, 5),
        "response_schema": schema_hint,
    }

    client = AsyncOpenAI(api_key=api_key)
    response = await client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        temperature=0.1,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": json.dumps(user_prompt, default=str)},
        ],
    )

    content = response.choices[0].message.content or "{}"
    try:
        plan = AnalysisPlan.model_validate_json(content)
        return _correct_explicit_dimension(plan, question, columns, dtypes)
    except (ValidationError, ValueError, json.JSONDecodeError) as exc:
        raise ValueError("DataLens could not create a valid analysis for that question. Try rephrasing.") from exc
