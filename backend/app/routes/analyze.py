from fastapi import APIRouter, HTTPException

from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.ai_service import build_analysis_plan
from app.services.analysis_service import run_analysis
from app.utils.file_store import DatasetNotFoundError

router = APIRouter(tags=["analyze"])


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_dataset(request: AnalyzeRequest) -> AnalyzeResponse:
    try:
        plan = await build_analysis_plan(request.dataset_id, request.question)
        return run_analysis(request.dataset_id, request.question, plan)
    except DatasetNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Analysis failed. Try rephrasing the question or using a simpler CSV.",
        ) from exc
