import json
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import select

from ..database import SessionLocal, get_db
from ..models import Message
from ..schemas import ChatMessageOut, ChatOut, ChatRequest
from ..services import rag
from .deps import require_service

router = APIRouter(prefix="/chat", tags=["chat"])


def _sse(event: str, data: object) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


@router.post("", response_model=ChatOut)
async def ask(
    payload: ChatRequest,
    user_id: str = Depends(require_service),
    db=Depends(get_db),
):
    result = await rag.answer(db, user_id, payload.question, payload.document_ids, payload.history)
    if payload.history is None:
        user_msg = Message(
            id=uuid.uuid4(), user_id=user_id, role="user", content=payload.question, sources=None
        )
        assistant_msg = Message(
            id=uuid.uuid4(),
            user_id=user_id,
            role="assistant",
            content=result["answer"],
            sources=result["sources"],
        )
        db.add_all([user_msg, assistant_msg])
        db.commit()
    return result


@router.post("/stream")
async def ask_stream(
    payload: ChatRequest,
    user_id: str = Depends(require_service),
    db=Depends(get_db),
):
    if not payload.question.strip():
        raise HTTPException(status_code=400, detail="Question is required")

    # Do retrieval up-front while the request-scoped session is alive, then
    # stream using the shared async LLM client. Message persistence happens in
    # a fresh session after streaming completes so the request-scoped DB
    # session is not held open during the (potentially 10-30s) SSE stream.
    messages, sources = await rag.prepare_chat(db, user_id, payload.question, payload.document_ids, payload.history)

    async def event_stream():
        full_answer = ""
        yield _sse("meta", {"question": payload.question})

        if not messages:
            async for item in rag.no_documents_reply():
                if item["type"] == "delta":
                    full_answer += item["data"]
                    yield _sse("delta", {"text": item["data"]})
                elif item["type"] == "sources":
                    yield _sse("sources", {"sources": item["data"]})
        else:
            async for item in rag.stream_chat(messages, sources):
                if item["type"] == "delta":
                    full_answer += item["data"]
                    yield _sse("delta", {"text": item["data"]})
                elif item["type"] == "sources":
                    yield _sse("sources", {"sources": item["data"]})
                elif item["type"] == "error":
                    yield _sse("error", {"message": item["data"]})
                    return

        if payload.history is None:
            await rag.save_message_pair(user_id, payload.question, full_answer, sources)
        yield _sse("done", {})

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.get("/history", response_model=list[ChatMessageOut])
def history(
    user_id: str = Depends(require_service),
    db=Depends(get_db),
    limit: int = Query(default=50, ge=1, le=200),
):
    rows = db.execute(
        select(Message).where(Message.user_id == user_id).order_by(Message.created_at.desc()).limit(limit)
    ).scalars().all()
    return list(reversed(rows))
