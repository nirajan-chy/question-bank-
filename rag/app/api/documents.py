from fastapi import APIRouter, Depends, HTTPException, UploadFile

from ..database import get_db
from ..schemas import DocumentOut
from ..services import ingestion, rag, retriever
from .deps import require_service

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("", response_model=list[DocumentOut])
def list_documents(
    user_id: str = Depends(require_service), db=Depends(get_db)
):
    return retriever.list_documents(db, user_id)


@router.post("", response_model=DocumentOut, status_code=201)
async def upload_document(
    file: UploadFile,
    user_id: str = Depends(require_service),
    db=Depends(get_db),
):
    data = await file.read()
    try:
        ingestion.validate_upload(file.filename or "document", len(data))
    except ingestion.IngestionError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    try:
        return rag.ingest_document(db, user_id, file.filename or "document", data)
    except ingestion.IngestionError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Ingestion failed: {exc}") from exc


@router.delete("/{document_id}", status_code=204)
def delete_document(
    document_id: str,
    user_id: str = Depends(require_service),
    db=Depends(get_db),
):
    document = retriever.get_document(db, user_id, document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    retriever.delete_document(db, document_id)
