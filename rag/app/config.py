from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    rag_db_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/sandarbh"
    openrouter_api_key: str = ""
    rag_llm_model: str = "openai/gpt-4o-mini"
    rag_embedding_model: str = "openai/text-embedding-3-small"
    rag_service_secret: str
    rag_chunk_size: int = 1000
    rag_chunk_overlap: int = 200
    rag_top_k: int = 6
    rag_max_file_size_mb: int = 100
    rag_embedding_dim: int = 1536

    @property
    def max_file_bytes(self) -> int:
        return self.rag_max_file_size_mb * 1024 * 1024


@lru_cache
def get_settings() -> Settings:
    return Settings()
