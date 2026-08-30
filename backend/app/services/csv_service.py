import io

import pandas as pd
from fastapi import UploadFile

from app.models.schemas import UploadResponse
from app.utils.dataframe_helpers import (
    clean_dataframe,
    dataframe_preview,
    dtype_map,
    summarize_dataframe,
)
from app.utils.file_store import create_dataset_id, save_dataframe

MAX_UPLOAD_BYTES = 10 * 1024 * 1024


def _read_csv(content: bytes) -> pd.DataFrame:
    errors: list[str] = []
    for encoding in ("utf-8-sig", "utf-8", "latin-1"):
        try:
            return pd.read_csv(io.BytesIO(content), encoding=encoding, sep=None, engine="python")
        except UnicodeDecodeError as exc:
            errors.append(str(exc))
        except pd.errors.ParserError as exc:
            errors.append(str(exc))

    try:
        return pd.read_csv(io.BytesIO(content))
    except Exception as exc:
        raise ValueError("Could not read the CSV. Check the delimiter, headers, and encoding.") from exc


async def parse_and_store_csv(file: UploadFile) -> UploadResponse:
    content = await file.read()
    if not content:
        raise ValueError("The uploaded file is empty.")
    if len(content) > MAX_UPLOAD_BYTES:
        raise ValueError("CSV is too large. Please upload a file up to 10MB.")

    dataframe = _read_csv(content)

    if dataframe.empty or len(dataframe.columns) == 0:
        raise ValueError("The CSV does not contain usable rows or columns.")

    dataframe = clean_dataframe(dataframe)
    if dataframe.empty or len(dataframe.columns) == 0:
        raise ValueError("The CSV only contains blank rows or columns.")

    dataset_id = create_dataset_id()
    save_dataframe(dataset_id, dataframe)

    return UploadResponse(
        dataset_id=dataset_id,
        file_name=file.filename or "dataset.csv",
        rows=int(len(dataframe)),
        columns=int(len(dataframe.columns)),
        column_names=dataframe.columns.tolist(),
        dtypes=dtype_map(dataframe),
        preview=dataframe_preview(dataframe),
        summary=summarize_dataframe(dataframe),
    )
