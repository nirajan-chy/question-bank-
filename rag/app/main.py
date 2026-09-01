import logging
import os
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .api import chat, documents, mcq
from .config import get_settings
from .database import init_db
from .http_client import close_client

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("rag")

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    if os.environ.get("RAG_SKIP_DB_INIT") != "1":
        try:
            init_db()
            logger.info("pgvector extension + tables ready")
        except Exception as exc:
            logger.error(
                "Could not initialize the database — the RAG service will start but endpoints "
                "will fail until the database is reachable. Error: %s",
                exc,
            )
    yield
    await close_client()


app = FastAPI(
    title="Sandarbh RAG Service",
    description="Document ingestion, retrieval-augmented Q&A and MCQ generation "
    "backed by PostgreSQL (pgvector) and OpenRouter.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("CLIENT_URL", "http://localhost:3000")],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

app.include_router(documents.router, prefix="/rag")
app.include_router(chat.router, prefix="/rag")
app.include_router(mcq.router, prefix="/rag")


@app.get("/rag/health")
def health():
    return {"status": "ok", "service": "rag", "timestamp": time.time()}


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Internal service error"})
