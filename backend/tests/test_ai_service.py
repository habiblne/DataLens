import unittest
from types import SimpleNamespace
from unittest.mock import patch

import pandas as pd

from app.models.schemas import AnalysisPlan
from app.services.ai_service import build_analysis_plan, _correct_explicit_dimension, _fallback_plan
from app.services.analysis_service import run_analysis
from app.utils.dataframe_helpers import clean_dataframe, dtype_map
from app.utils.file_store import save_dataframe


DATASET_ID = "123456abcdef"


def test_dataframe() -> pd.DataFrame:
    return clean_dataframe(
        pd.DataFrame(
            [
                ["2026-01-01", "South", "Phone", 20, 12000, 3000],
                ["2026-01-02", "North", "Phone", 18, 10800, 2500],
                ["2026-01-03", "East", "Phone", 22, 13200, 2800],
                ["2026-01-04", "West", "Phone", 20, 12000, 2800],
                ["2026-01-05", "South", "Laptop", 10, 15000, 2500],
                ["2026-01-06", "North", "Laptop", 12, 18000, 2400],
                ["2026-01-07", "East", "Laptop", 11, 16500, 2300],
                ["2026-01-08", "West", "Laptop", 13, 19500, 2500],
                ["2026-01-09", "South", "Tablet", 25, 10000, 2200],
                ["2026-01-10", "North", "Tablet", 26, 10400, 2300],
                ["2026-01-11", "East", "Tablet", 24, 9600, 2250],
                ["2026-01-12", "West", "Tablet", 25, 10000, 2200],
                ["2026-01-13", "South", "Headphones", 40, 4000, 1800],
                ["2026-01-14", "North", "Headphones", 38, 3800, 1850],
                ["2026-01-15", "East", "Headphones", 39, 3900, 1900],
                ["2026-01-16", "West", "Headphones", 37, 3700, 1800],
                ["2026-01-17", "South", "Monitor", 12, 9200, 1100],
                ["2026-01-18", "North", "Monitor", 14, 6000, 1200],
                ["2026-01-19", "East", "Monitor", 13, 5000, 1000],
                ["2026-01-20", "West", "Monitor", 11, 4000, 1130],
            ],
            columns=["date", "region", "product", "units_sold", "sales", "profit"],
        )
    )


class PlannerDimensionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.dataframe = test_dataframe()
        cls.dtypes = dtype_map(cls.dataframe)
        cls.columns = cls.dataframe.columns.tolist()
        save_dataframe(DATASET_ID, cls.dataframe)

    def wrong_plan(self, group_by: str, metric: str) -> AnalysisPlan:
        return AnalysisPlan(
            intent="comparison",
            x_column=group_by,
            y_column=metric,
            operation="sum",
            group_by=group_by,
            filter=None,
            chart_type="bar",
            limit=10,
        )

    def assert_question(
        self,
        question: str,
        wrong_group_by: str,
        expected_group_by: str,
        metric: str,
        leader: str,
        value: int,
    ) -> None:
        plan = _correct_explicit_dimension(
            self.wrong_plan(wrong_group_by, metric),
            question,
            self.columns,
            self.dtypes,
        )

        self.assertEqual(expected_group_by, plan.group_by)
        self.assertEqual(expected_group_by, plan.x_column)

        response = run_analysis(DATASET_ID, question, plan)
        self.assertEqual(expected_group_by, response.chart.xKey)
        self.assertEqual(f"sum_{metric}", response.chart.yKey)
        self.assertEqual(leader, response.table[0][expected_group_by])
        self.assertEqual(value, response.table[0][f"sum_{metric}"])

    def test_product_profit_question_uses_product_dimension(self) -> None:
        self.assert_question(
            "Which product generated the most profit?",
            wrong_group_by="region",
            expected_group_by="product",
            metric="profit",
            leader="Phone",
            value=11100,
        )

    def test_region_profit_question_uses_region_dimension(self) -> None:
        self.assert_question(
            "Which region generated the most profit?",
            wrong_group_by="product",
            expected_group_by="region",
            metric="profit",
            leader="South",
            value=10600,
        )

    def test_product_sales_question_uses_product_dimension(self) -> None:
        self.assert_question(
            "Which product generated the most sales?",
            wrong_group_by="region",
            expected_group_by="product",
            metric="sales",
            leader="Laptop",
            value=69000,
        )

    def test_region_sales_question_uses_region_dimension(self) -> None:
        self.assert_question(
            "Which region generated the most sales?",
            wrong_group_by="product",
            expected_group_by="region",
            metric="sales",
            leader="South",
            value=50200,
        )

    def test_product_units_question_uses_product_dimension_and_units_metric(self) -> None:
        plan = _fallback_plan("Which product sold the most units?", self.columns, self.dtypes)

        self.assertEqual("product", plan.group_by)
        self.assertEqual("units_sold", plan.y_column)

        response = run_analysis(DATASET_ID, "Which product sold the most units?", plan)

        self.assertEqual("product", response.chart.xKey)
        self.assertEqual("sum_units_sold", response.chart.yKey)
        self.assertEqual("Headphones", response.table[0]["product"])
        self.assertEqual(154, response.table[0]["sum_units_sold"])

    def test_fallback_generic_question_still_uses_first_categorical_dimension(self) -> None:
        plan = _fallback_plan("Which segment generated the most profit?", self.columns, self.dtypes)

        self.assertEqual("region", plan.group_by)
        self.assertEqual("profit", plan.y_column)


class BuildAnalysisPlanTests(unittest.IsolatedAsyncioTestCase):
    @classmethod
    def setUpClass(cls) -> None:
        dataframe = test_dataframe()
        save_dataframe(DATASET_ID, dataframe)

    async def test_llm_plan_is_corrected_when_question_mentions_dimension(self) -> None:
        bad_plan = """
        {
          "intent": "comparison",
          "x_column": "region",
          "y_column": "profit",
          "operation": "sum",
          "group_by": "region",
          "filter": null,
          "chart_type": "bar",
          "limit": 10
        }
        """

        class FakeCompletions:
            async def create(self, **kwargs):
                return SimpleNamespace(
                    choices=[SimpleNamespace(message=SimpleNamespace(content=bad_plan))]
                )

        class FakeClient:
            def __init__(self, api_key: str):
                self.chat = SimpleNamespace(completions=FakeCompletions())

        with patch.dict("os.environ", {"OPENAI_API_KEY": "test-key"}):
            with patch("app.services.ai_service.AsyncOpenAI", FakeClient):
                plan = await build_analysis_plan(DATASET_ID, "Which product generated the most profit?")

        self.assertEqual("product", plan.group_by)
        self.assertEqual("product", plan.x_column)
        self.assertEqual("profit", plan.y_column)
        self.assertEqual("sum", plan.operation)


if __name__ == "__main__":
    unittest.main()
