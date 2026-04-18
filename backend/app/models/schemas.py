from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator

ChartType = Literal["bar", "line", "pie", "area"]
Intent = Literal["aggregate", "trend", "comparison", "distribution"]
Operation = Literal["sum", "avg", "count", "max", "min"]
FilterOperator = Literal["=", "!=", ">", "<", ">=", "<="]


class DatasetSummary(BaseModel):
    numeric_columns: list[str]
    categorical_columns: list[str]
    datetime_columns: list[str]
    missing_values: dict[str, int]


class UploadResponse(BaseModel):
    dataset_id: str
    file_name: str
    rows: int
    columns: int
    column_names: list[str]
    dtypes: dict[str, str]
    preview: list[dict[str, Any]]
    summary: DatasetSummary


class AnalyzeRequest(BaseModel):
    dataset_id: str
    question: str = Field(min_length=3, max_length=500)


class AnalysisFilter(BaseModel):
    column: str
    operator: FilterOperator
    value: str | int | float | None

    @field_validator("column")
    @classmethod
    def strip_column(cls, value: str) -> str:
        return value.strip()


class AnalysisPlan(BaseModel):
    intent: Intent
    x_column: str
    y_column: str | None = None
    operation: Operation
    group_by: str | None = None
    filter: AnalysisFilter | None = None
    chart_type: ChartType
    limit: int = Field(default=10, ge=1, le=50)

    @field_validator("x_column", "y_column", "group_by")
    @classmethod
    def strip_column(cls, value: str | None) -> str | None:
        return value.strip() if isinstance(value, str) else value


class ChartConfig(BaseModel):
    type: ChartType
    title: str
    xKey: str
    yKey: str
    data: list[dict[str, Any]]


class AnalyzeResponse(BaseModel):
    answer: str
    chart: ChartConfig
    insights: list[str]
    table: list[dict[str, Any]] | None = None
