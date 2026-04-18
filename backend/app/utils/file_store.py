import tempfile
import uuid
from pathlib import Path
import re

import pandas as pd

DATA_DIR = Path(tempfile.gettempdir()) / "datalens_uploads"
DATA_DIR.mkdir(parents=True, exist_ok=True)
DATASET_ID_PATTERN = re.compile(r"^[a-f0-9]{12}$")


class DatasetNotFoundError(ValueError):
    pass


def create_dataset_id() -> str:
    return uuid.uuid4().hex[:12]


def dataset_path(dataset_id: str) -> Path:
    if not DATASET_ID_PATTERN.fullmatch(dataset_id):
        raise DatasetNotFoundError("Invalid dataset id. Please upload the CSV again.")
    return DATA_DIR / f"{dataset_id}.pkl"


def save_dataframe(dataset_id: str, dataframe: pd.DataFrame) -> None:
    dataframe.to_pickle(dataset_path(dataset_id))


def load_dataframe(dataset_id: str) -> pd.DataFrame:
    path = dataset_path(dataset_id)
    if not path.exists():
        raise DatasetNotFoundError("Dataset not found. Please upload the CSV again.")
    return pd.read_pickle(path)
