import type { AnalyzeRequest, AnalyzeResponse, UploadResponse } from "./types";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

async function parseApiError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { detail?: unknown };
    if (typeof payload.detail === "string") {
      return payload.detail;
    }
    if (Array.isArray(payload.detail)) {
      return payload.detail
        .map((item) => {
          if (typeof item === "object" && item && "msg" in item) {
            return String(item.msg);
          }
          return String(item);
        })
        .join(" ");
    }
  } catch {
    return response.statusText || "Request failed.";
  }

  return response.statusText || "Request failed.";
}

export async function uploadCsv(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData
    });
  } catch {
    throw new Error("Could not reach the DataLens API. Make sure the FastAPI backend is running.");
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<UploadResponse>;
}

export async function analyzeDataset(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    });
  } catch {
    throw new Error("Could not reach the DataLens API. Make sure the FastAPI backend is running.");
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<AnalyzeResponse>;
}
