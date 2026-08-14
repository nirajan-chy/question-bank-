import json
import re

from ..http_client import get_client

CHAT_URL = "https://openrouter.ai/api/v1/chat/completions"


async def _headers() -> dict[str, str]:
    from ..config import get_settings
    settings = get_settings()
    if not settings.openrouter_api_key:
        raise RuntimeError("OPENROUTER_API_KEY is not configured in rag/.env")
    return {
        "Authorization": f"Bearer {settings.openrouter_api_key}",
        "Content-Type": "application/json",
    }


async def chat(messages: list[dict], temperature: float = 0.3, max_tokens: int = 1500) -> str:
    """Non-streaming chat completion. Returns the assistant text."""
    from ..config import get_settings
    settings = get_settings()
    client = await get_client()
    response = await client.post(
        CHAT_URL,
        headers=await _headers(),
        json={
            "model": settings.rag_llm_model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        },
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]


async def chat_stream(messages: list[dict], temperature: float = 0.3, max_tokens: int = 1500):
    """Streaming chat completion. Yields text deltas."""
    from ..config import get_settings
    settings = get_settings()
    client = await get_client()
    async with client.stream(
        "POST",
        CHAT_URL,
        headers=await _headers(),
        json={
            "model": settings.rag_llm_model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": True,
        },
    ) as response:
        response.raise_for_status()
        async for line in response.aiter_lines():
            if not line or not line.startswith("data:"):
                continue
            payload = line[5:].strip()
            if payload == "[DONE]":
                break
            try:
                delta = json.loads(payload)["choices"][0]["delta"].get("content")
            except (json.JSONDecodeError, KeyError, IndexError, TypeError):
                continue
            if delta:
                yield delta


_JSON_FENCE = re.compile(r"```(?:json)?\s*([\s\S]*?)```")


async def chat_json(messages: list[dict], temperature: float = 0.2, max_tokens: int = 3000) -> dict:
    """Chat completion that must return a JSON object. Strips markdown fences."""
    messages = list(messages) + [
        {
            "role": "system",
            "content": "You must respond with ONLY valid JSON. No markdown fences, no commentary, "
            "no trailing text. Output must parse with json.loads.",
        }
    ]
    raw = await chat(messages, temperature=temperature, max_tokens=max_tokens)
    fenced = _JSON_FENCE.search(raw)
    candidate = fenced.group(1) if fenced else raw
    try:
        return json.loads(candidate)
    except json.JSONDecodeError:
        start, end = candidate.find("{"), candidate.rfind("}")
        if start != -1 and end > start:
            return json.loads(candidate[start : end + 1])
        raise
