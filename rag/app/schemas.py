from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class DocumentOut(BaseModel):
    id: str
    filename: str
    file_type: str
    status: str
    error: str | None = None
    chunk_count: int
    char_count: int
    created_at: datetime

    model_config = {"from_attributes": True}

    @field_validator("id", mode="before")
    @classmethod
    def coerce_id(cls, v):
        return str(v) if isinstance(v, UUID) else v


class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=4000)
    document_ids: list[str] | None = None
    history: list[dict[str, str]] | None = None


class SourceOut(BaseModel):
    document_id: str
    document_name: str
    snippet: str
    page: int | None = None


class ChatOut(BaseModel):
    answer: str
    sources: list[SourceOut] = []


class ChatMessageOut(BaseModel):
    id: str
    role: str
    content: str
    sources: list[dict[str, Any]] | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class McqGenerateRequest(BaseModel):
    count: int = Field(default=5, ge=1, le=20)
    difficulty: str = Field(default="medium", pattern="^(easy|medium|hard)$")
    topics: str | None = Field(default=None, max_length=500)
    document_ids: list[str] | None = None
    notes: str | None = Field(default=None, max_length=2000)


class McqQuestionOut(BaseModel):
    question: str
    options: list[str]
    topic: str | None = None


class McqOut(BaseModel):
    id: str
    title: str
    difficulty: str
    status: str
    score: int
    total: int
    questions: list[McqQuestionOut]
    created_at: datetime


class McqSubmitRequest(BaseModel):
    answers: list[int]


class McqResultQuestion(BaseModel):
    question: str
    options: list[str]
    selected: int | None
    correct_index: int
    correct: bool
    explanation: str
    topic: str | None = None


class McqSubmitOut(BaseModel):
    id: str
    score: int
    total: int
    passed: bool
    pass_percent: int = 60
    results: list[McqResultQuestion]
