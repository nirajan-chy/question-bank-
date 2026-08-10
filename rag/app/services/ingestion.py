import io
import re

from docx import Document as DocxDocument
from pypdf import PdfReader

from ..config import get_settings

settings = get_settings()

ALLOWED_TYPES = {"pdf": "pdf", "docx": "docx", "txt": "txt"}
_WHITESPACE = re.compile(r"\s+")


class IngestionError(Exception):
    pass


def validate_upload(filename: str, size: int) -> str:
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_TYPES:
        raise IngestionError("Unsupported file type. Upload a PDF, DOCX or TXT file.")
    if size > settings.max_file_bytes:
        raise IngestionError(
            f"File is too large. Maximum size is {settings.rag_max_file_size_mb} MB."
        )
    return ext


def extract_text(filename: str, data: bytes) -> tuple[str, list[int | None]]:
    """Extract raw text from a PDF/DOCX/TXT upload.

    Returns (full_text, pages_per_character_index) so chunks can carry page numbers.
    """
    ext = ALLOWED_TYPES[filename.rsplit(".", 1)[-1].lower()]

    if ext == "txt":
        try:
            text = data.decode("utf-8")
        except UnicodeDecodeError:
            text = data.decode("latin-1")
        return text, []

    if ext == "docx":
        try:
            document = DocxDocument(io.BytesIO(data))
            paragraphs = [p.text for p in document.paragraphs if p.text.strip()]
        except Exception as exc:
            raise IngestionError(f"Could not read DOCX file: {exc}") from exc
        return "\n\n".join(paragraphs), []

    if ext == "pdf":
        try:
            reader = PdfReader(io.BytesIO(data))
            pages: list[tuple[str, int]] = []
            for i, page in enumerate(reader.pages, start=1):
                try:
                    text = page.extract_text() or ""
                except Exception:
                    text = ""
                if text.strip():
                    pages.append((text, i))
        except Exception as exc:
            raise IngestionError(f"Could not read PDF file: {exc}") from exc

        full: list[str] = []
        mapping: list[int | None] = []
        for text, page in pages:
            full.append(text)
            mapping.extend([page] * len(text))
        return "\n".join(full), mapping

    raise IngestionError("Unsupported file type.")


def clean_text(text: str) -> str:
    text = text.replace("\x00", "").replace("\r\n", "\n").replace("\r", "\n")
    text = _WHITESPACE.sub(" ", text)
    return text.strip()


def split_chunks(text: str, page_mapping: list[int | None] | None = None) -> list[dict]:
    """Recursive paragraph-aware chunking with overlap. Returns [{content, page}]."""
    size = settings.rag_chunk_size
    overlap = settings.rag_chunk_overlap
    step = max(size - overlap, 1)

    paragraphs = [p.strip() for p in re.split(r"\n{2,}", text) if p.strip()]
    if not paragraphs:
        return []

    units: list[str] = []
    for para in paragraphs:
        while len(para) > size:
            units.append(para[:size])
            para = para[size - overlap :]
        if para:
            units.append(para)

    chunks: list[dict] = []
    buffer = ""
    for unit in units:
        if len(buffer) + len(unit) + 2 <= size:
            buffer = f"{buffer} {unit}".strip()
        else:
            if buffer:
                chunks.append({"content": buffer})
            buffer = unit
    if buffer:
        chunks.append({"content": buffer})

    if page_mapping:
        for chunk in chunks:
            content = chunk["content"]
            index = text.find(content)
            chunk["page"] = page_mapping[index] if index != -1 else None

    return chunks
