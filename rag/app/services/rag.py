import traceback
import uuid

from ..config import get_settings
from ..database import SessionLocal
from ..models import Chunk, Document
from .embeddings import embed_texts
from .ingestion import (
    IngestionError,
    clean_text,
    extract_text,
    split_chunks,
    validate_upload,
)

settings = get_settings()


def create_document_record(db, user_id: str, filename: str, data: bytes) -> Document:
    """Persist the document in 'processing' state so the UI can poll it immediately."""
    ext = validate_upload(filename, len(data))
    document = Document(
        id=uuid.uuid4(),
        user_id=user_id,
        filename=filename,
        file_type=ext,
        status="processing",
        chunk_count=0,
        char_count=0,
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


async def ingest_document(document_id: str, user_id: str, filename: str, data: bytes) -> None:
    """Full ingestion pipeline: validate → extract → clean → chunk → embed → store.

    Runs in its own SessionLocal so it does not hold the request-scoped session
    during the (potentially slow) embedding API calls.
    """
    db = SessionLocal()
    try:
        document = db.get(Document, document_id)
        if document is None:
            return

        raw_text, page_mapping = extract_text(filename, data)
        text = clean_text(raw_text)
        if not text:
            raise IngestionError("No readable text was found in the file.")

        chunks = split_chunks(text, page_mapping)
        if not chunks:
            raise IngestionError("Could not split the document into chunks.")

        contents = [chunk["content"] for chunk in chunks]
        embeddings = await embed_texts(contents)

        rows = []
        for index, (chunk, vector) in enumerate(zip(chunks, embeddings)):
            rows.append(
                Chunk(
                    id=uuid.uuid4(),
                    document_id=document.id,
                    user_id=user_id,
                    position=index,
                    page=chunk.get("page"),
                    content=chunk["content"],
                    embedding=vector,
                )
            )
        db.add_all(rows)
        document.chunk_count = len(rows)
        document.char_count = len(text)
        document.status = "ready"
        document.error = None
        db.commit()
    except Exception as exc:
        db.rollback()
        try:
            document = db.get(Document, document_id)
            if document:
                document.status = "failed"
                document.error = f"{type(exc).__name__}: {exc}"
                db.commit()
        except Exception:
            db.rollback()
        raise
    finally:
        db.close()


def _format_context(chunks: list[Chunk]) -> tuple[str, list[dict]]:
    sources: list[dict] = []
    parts: list[str] = []
    for i, chunk in enumerate(chunks, start=1):
        parts.append(f"[{i}] (source: {chunk.document.filename}, page {chunk.page or 'n/a'})\n{chunk.content}")
        sources.append(
            {
                "document_id": str(chunk.document_id),
                "document_name": chunk.document.filename,
                "snippet": chunk.content[:400],
                "page": chunk.page,
            }
        )
    return "\n\n".join(parts), sources


def _system_prompt(context: str) -> str:
    return (
        "You are a precise study assistant for a self-learning center. "
        "Answer the user's question STRICTLY using the reference material provided below. "
        "Follow these rules:\n"
        "1. Only answer from the given material. If the answer is not in the material, say "
        "'I couldn't find this in your uploaded documents.' and suggest related topics you do find.\n"
        "2. Cite the source after each statement using the bracketed numbers, e.g. [1] or [2].\n"
        "3. Keep the answer clear, structured and study-friendly (short paragraphs or bullets).\n"
        "4. If the question references a specific topic, focus your answer on that topic.\n\n"
        "===== REFERENCE MATERIAL =====\n"
        f"{context}"
    )


def _history_messages(history: list[dict] | None, max_items: int = 8) -> list[dict]:
    if not history:
        return []
    cleaned = [{"role": "user" if m.get("role") == "user" else "assistant", "content": m.get("content", "")} for m in history]
    return cleaned[-max_items * 2 :]


async def answer(db, user_id: str, question: str, document_ids: list[str] | None, history: list[dict] | None):
    """Non-streaming RAG answer with citations."""
    from .llm import chat
    from .retriever import search_chunks

    chunks = [chunk for chunk, _ in await search_chunks(db, user_id, question, document_ids=document_ids)]
    if not chunks:
        return {
            "answer": "Upload a document first, then I can answer questions about it. "
            "Go to the Documents tab and upload a PDF, DOCX or TXT file.",
            "sources": [],
        }

    context, sources = _format_context(chunks)
    messages = _history_messages(history) + [
        {"role": "system", "content": _system_prompt(context)},
        {"role": "user", "content": question},
    ]
    answer_text = await chat(messages, temperature=0.2)
    return {"answer": answer_text, "sources": sources}


async def prepare_chat(db, user_id: str, question: str, document_ids: list[str] | None, history: list[dict] | None) -> tuple[list[dict], list[dict]]:
    """Resolve chunks and build messages for the streaming endpoint."""
    from .retriever import search_chunks

    chunks = [chunk for chunk, _ in await search_chunks(db, user_id, question, document_ids=document_ids)]
    if not chunks:
        return [], []

    context, sources = _format_context(chunks)
    messages = _history_messages(history) + [
        {"role": "system", "content": _system_prompt(context)},
        {"role": "user", "content": question},
    ]
    return messages, sources


async def stream_chat(messages: list[dict], sources: list[dict]):
    """Async generator that yields SSE-friendly dicts for the streaming endpoint."""
    from .llm import chat_stream

    try:
        async for delta in chat_stream(messages, temperature=0.2):
            yield {"type": "delta", "data": delta}
        yield {"type": "sources", "data": sources}
    except Exception as exc:
        yield {"type": "error", "data": str(exc)}


async def no_documents_reply():
    yield {
        "type": "delta",
        "data": "Upload a document first, then I can answer questions about it. "
        "Go to the Documents tab and upload a PDF, DOCX or TXT file.",
    }
    yield {"type": "sources", "data": []}


async def save_message_pair(user_id: str, question: str, answer_text: str, sources: list[dict]) -> None:
    """Persist user + assistant messages in a fresh session (called after streaming ends)."""
    from ..models import Message
    db = SessionLocal()
    try:
        db.add_all([
            Message(id=uuid.uuid4(), user_id=user_id, role="user", content=question, sources=None),
            Message(id=uuid.uuid4(), user_id=user_id, role="assistant", content=answer_text, sources=sources),
        ])
        db.commit()
    finally:
        db.close()
