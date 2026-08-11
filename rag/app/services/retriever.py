from sqlalchemy import delete, select, text

from ..config import get_settings
from ..models import Chunk, Document
from .embeddings import embed_text

settings = get_settings()


def search_chunks(
    db,
    user_id: str,
    query: str,
    top_k: int | None = None,
    document_ids: list[str] | None = None,
) -> list[tuple[Chunk, float]]:
    """Vector similarity search over the user's chunks using cosine distance (<=>)."""
    k = top_k or settings.rag_top_k

    # Short-circuit: skip the embedding API call when there are no chunks
    count_stmt = select(Chunk.id).where(Chunk.user_id == user_id).limit(1)
    if document_ids:
        count_stmt = count_stmt.where(Chunk.document_id.in_(document_ids))
    if not db.execute(count_stmt).first():
        return []

    query_vector = embed_text(query)

    stmt = (
        select(
            Chunk,
            (Chunk.embedding.cosine_distance(query_vector)).label("distance"),
        )
        .where(Chunk.user_id == user_id)
        .order_by(Chunk.embedding.cosine_distance(query_vector))
        .limit(k)
    )
    if document_ids:
        stmt = stmt.where(Chunk.document_id.in_(document_ids))

    rows = db.execute(stmt).all()
    return [(chunk, float(distance)) for chunk, distance in rows]


def sample_chunks(
    db, user_id: str, limit: int, document_ids: list[str] | None = None
) -> list[Chunk]:
    """Random-ish sample of chunks across the user's documents (used for broad MCQs)."""
    stmt = select(Chunk).where(Chunk.user_id == user_id).order_by(text("random()")).limit(limit)
    if document_ids:
        stmt = stmt.where(Chunk.document_id.in_(document_ids))
    return list(db.execute(stmt).scalars().all())


def list_documents(db, user_id: str) -> list[Document]:
    stmt = (
        select(Document)
        .where(Document.user_id == user_id)
        .order_by(Document.created_at.desc())
    )
    return list(db.execute(stmt).scalars().all())


def get_document(db, user_id: str, document_id: str) -> Document | None:
    return db.execute(
        select(Document).where(Document.id == document_id, Document.user_id == user_id)
    ).scalar_one_or_none()


def delete_document(db, document_id: str) -> None:
    db.execute(delete(Chunk).where(Chunk.document_id == document_id))
    db.execute(delete(Document).where(Document.id == document_id))
    db.commit()
