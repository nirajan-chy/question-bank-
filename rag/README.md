# Sandarbh RAG Service

Python microservice powering the **Self Learning Center**: users upload their own study
material (PDF / DOCX / TXT), ask questions that are answered **only from their documents**
(grounded RAG with citations), and generate multiple-choice quizzes from their material.

## Architecture

```
rag/
├── requirements.txt
├── .env.example
└── app/
    ├── main.py              # FastAPI app, CORS, startup DB init
    ├── config.py            # env-driven settings
    ├── database.py          # SQLAlchemy engine + pgvector bootstrap
    ├── models.py            # rag_documents, rag_chunks, rag_messages, rag_quizzes
    ├── schemas.py           # Pydantic request/response models
    ├── api/
    │   ├── deps.py          # gateway auth (X-User-Id + shared secret)
    │   ├── documents.py     # upload / list / delete documents
    │   ├── chat.py          # grounded Q&A (JSON + SSE streaming)
    │   └── mcq.py           # generate / fetch / submit quizzes
    └── services/
        ├── ingestion.py     # parse PDF/DOCX/TXT → clean → chunk (overlap + page refs)
        ├── embeddings.py    # OpenRouter embeddings (openai/text-embedding-3-small)
        ├── llm.py           # OpenRouter chat completions (+ strict-JSON helper)
        ├── retriever.py     # pgvector cosine search, scoped per user
        ├── rag.py           # answer pipeline with citations
        └── mcq.py           # quiz generation, validation, scoring
```

**Pipeline:** upload → validate → extract text → clean → recursive chunking
(`RAG_CHUNK_SIZE` chars with `RAG_CHUNK_OVERLAP` overlap, page numbers for PDFs)
→ embed in batches → store in PostgreSQL via **pgvector** (HNSW index).
On question: embed the query → cosine similarity search over the user's chunks only
→ build a grounded prompt → LLM answers with `[n]` citations → sources returned alongside.
MCQs: retrieve relevant chunks (topics-aware) → LLM emits strict JSON → schema-validated
→ stored; answers are graded on submit with explanations.

## Setup

```bash
cd rag
python -m venv .venv
.venv\Scripts\activate          # Windows (or source .venv/bin/activate on Linux/macOS)
pip install -r requirements.txt
cp .env.example .env            # fill in RAG_DB_URL, OPENROUTER_API_KEY, RAG_SERVICE_SECRET
uvicorn app.main:app --reload --port 8000
```

Requirements:

- A PostgreSQL database (the same one the Express server uses). The service runs
  `CREATE EXTENSION IF NOT EXISTS vector` and creates its tables on startup —
  no manual migration needed.
- An OpenRouter API key for both chat and embeddings.

## Endpoints

All endpoints require headers `X-User-Id` and `X-Service-Secret` (injected by the
Express gateway — never call the service directly from the browser).

| Method | Path | Description |
| --- | --- | --- |
| GET | `/rag/health` | Health check |
| GET | `/rag/documents` | List the user's documents |
| POST | `/rag/documents` | Upload + ingest a file (multipart `file`) |
| DELETE | `/rag/documents/{id}` | Delete a document and its chunks |
| POST | `/rag/chat` | Grounded answer `{question, document_ids?, history?}` → `{answer, sources}` |
| POST | `/rag/chat/stream` | Same, as SSE (`meta` → `delta`* → `sources` → `done`) |
| GET | `/rag/chat/history?limit=` | Last chat messages |
| POST | `/rag/mcq/generate` | `{count, difficulty, topics?, document_ids?, notes?}` → sanitized quiz |
| GET | `/rag/mcq/{id}` | Fetch a quiz (answers hidden) |
| POST | `/rag/mcq/{id}/submit` | `{answers: [0-based indices]}` → score + explanations |

## Configuration (.env)

| Variable | Default | Description |
| --- | --- | --- |
| `RAG_DB_URL` | — | SQLAlchemy Postgres URL (`postgresql+psycopg://…`) |
| `OPENROUTER_API_KEY` | — | Key from https://openrouter.ai/keys |
| `RAG_LLM_MODEL` | `openai/gpt-4o-mini` | Chat model (any OpenRouter model id) |
| `RAG_EMBEDDING_MODEL` | `openai/text-embedding-3-small` | Embedding model (1536-dim, matches table) |
| `RAG_SERVICE_SECRET` | — | Shared secret; must match `RAG_SERVICE_SECRET` in `server/.env` |
| `RAG_CHUNK_SIZE` | 1000 | Target chunk size (characters) |
| `RAG_CHUNK_OVERLAP` | 200 | Overlap between chunks |
| `RAG_TOP_K` | 6 | Retrieved chunks per question |
| `RAG_MAX_FILE_SIZE_MB` | 20 | Upload limit |
