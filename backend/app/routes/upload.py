from fastapi import APIRouter, File, HTTPException, UploadFile

from app.models.schemas import UploadResponse
from app.services.csv_service import parse_and_store_csv

router = APIRouter(tags=["upload"])


@router.post("/upload", response_model=UploadResponse)
async def upload_csv(file: UploadFile = File(...)) -> UploadResponse:
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Please upload a CSV file.")

    try:
        return await parse_and_store_csv(file)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="We could not process that CSV. Please check the file and try again.",
        ) from exc
