# DataLens

DataLens is a hackathon MVP that lets users upload a CSV, preview the dataset, ask natural-language questions, and receive a concise answer, chart, insights, and optional result table.

## Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, Recharts
- Backend: FastAPI, Python, Pandas, Uvicorn
- AI: OpenAI API for safe structured analysis planning

## Features

- CSV upload and preview
- Dataset metadata and summary cards
- Natural-language analysis questions
- Safe AI planning with Pydantic validation
- Deterministic pandas execution
- Dynamic charts: bar, line, pie, area
- Dark polished hackathon UI

## Run Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

Backend runs at:

```txt
http://127.0.0.1:8000
```

## Run Frontend

```powershell
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Frontend runs at:

```txt
http://localhost:3000
```

## Environment

Backend:

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

Frontend:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## Demo Flow

1. Start the backend.
2. Start the frontend.
3. Upload a CSV file.
4. Ask a question like "Which region has the highest sales?"
5. Review the answer, chart, insights, and result table.
