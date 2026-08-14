from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool

from ..database import SessionLocal, get_db
from ..schemas import DocumentOut
from ..services import ingestion, rag, retriever
from .deps import require_service

router = APIRouter(prefix="/documents", tags=["documents"])

MAX_UPLOAD_BYTES = 100 * 1024 * 1024  # 100 MB


async def _read_limited(file: UploadFile) -> bytes:
    """Stream-upload in 1 MB chunks and abort if the file exceeds MAX_UPLOAD_BYTES."""
    chunks: list[bytes] = []
    total = 0
    while True:
        chunk = await file.read(1024 * 1024)
        if not chunk:
            break
        total += len(chunk)
        if total > MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail="File exceeds 100 MB limit")
        chunks.append(chunk)
    return b"".join(chunks)


@router.get("", response_model=list[DocumentOut])
def list_documents(
    user_id: str = Depends(require_service), db=Depends(get_db)
):
    return retriever.list_documents(db, user_id)


@router.post("", response_model=DocumentOut, status_code=202)
async def upload_document(
    file: UploadFile,
    user_id: str = Depends(require_service),
    background_tasks: BackgroundTasks,
):
    data = await _read_limited(file)
    try:
        ingestion.validate_upload(file.filename or "document", len(data))
    except ingestion.IngestionError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    # Persist the document immediately so the UI can poll its status.
    db = SessionLocal()
    try:
        document = rag.create_document_record(db, user_id, file.filename or "document", data)
    finally:
        db.close()

    background_tasks.add_task(rag.ingest_document, document.id, user_id, file.filename or "document", data)

    return document
