from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from .config import get_settings

settings = get_settings()

# pool_pre_ping is what keeps this alive on a lossy link (it discards sockets
# that died silently), but 5 + 10 overflow could ask Aiven for far more
# connections than the API needs to share with us. Two warm + a small overflow
# is plenty for a RAG service.
engine = create_engine(
    settings.rag_db_url,
    pool_pre_ping=True,
    pool_size=2,
    max_overflow=3,
    pool_recycle=1800,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


def init_db() -> None:
    """Enable the pgvector extension and create all tables (idempotent)."""
    with engine.begin() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
    from . import models  # noqa: F401  (register models before create_all)

    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
