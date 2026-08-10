import httpx

from ..config import get_settings

settings = get_settings()

EMBEDDINGS_URL = "https://openrouter.ai/api/v1/embeddings"
BATCH_SIZE = 32


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Embed a batch of texts via OpenRouter (OpenAI-compatible embeddings API)."""
    if not texts:
        return []
    if not settings.openrouter_api_key:
        raise RuntimeError("OPENROUTER_API_KEY is not configured in rag/.env")

    vectors: list[list[float]] = []
    with httpx.Client(timeout=120) as client:
        for start in range(0, len(texts), BATCH_SIZE):
            batch = texts[start : start + BATCH_SIZE]
            response = client.post(
                EMBEDDINGS_URL,
                headers={
                    "Authorization": f"Bearer {settings.openrouter_api_key}",
                    "Content-Type": "application/json",
                },
                json={"model": settings.rag_embedding_model, "input": batch, "encoding_format": "float"},
            )
            response.raise_for_status()
            data = response.json()
            vectors.extend(item["embedding"] for item in data["data"])
    return vectors


def embed_text(text: str) -> list[float]:
    return embed_texts([text])[0]
