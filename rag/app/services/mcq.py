import json
import uuid

from sqlalchemy import select

from ..models import Quiz
from ..schemas import McqGenerateRequest
from .llm import chat_json
from .retriever import sample_chunks, search_chunks

DIFFICULTY_GUIDE = {
    "easy": "fact recall, definitions and simple recognition; straightforward phrasing",
    "medium": "understanding and application; requires reasoning about the material",
    "hard": "analysis, synthesis and tricky distractors; close reading required",
}


async def _context_from_request(db, user_id: str, req: McqGenerateRequest) -> str:
    chunks = None
    if req.topics and req.topics.strip():
        query = f"{req.topics.strip()} ({req.difficulty} level)"
        chunks = [c for c, _ in await search_chunks(db, user_id, query, top_k=15, document_ids=req.document_ids)]
    if not chunks:
        chunks = await sample_chunks(db, user_id, limit=15, document_ids=req.document_ids)

    if not chunks:
        return ""
    parts = [
        f"[{i}] (source: {c.document.filename}, page {c.page or 'n/a'})\n{c.content}"
        for i, c in enumerate(chunks, start=1)
    ]
    return "\n\n".join(parts)


def _validate_questions(payload: dict) -> list[dict]:
    questions = payload.get("questions", [])
    if not isinstance(questions, list) or not questions:
        raise ValueError("LLM returned no questions")

    validated: list[dict] = []
    for q in questions:
        if not isinstance(q, dict):
            continue
        stem = str(q.get("question", "")).strip()
        options = q.get("options", [])
        correct = q.get("correct_index")
        if not stem or not isinstance(options, list) or len(options) < 2:
            continue
        options = [str(o).strip() for o in options if str(o).strip()][:4]
        if len(options) < 2:
            continue
        try:
            correct = int(correct)
        except (TypeError, ValueError):
            continue
        if not (0 <= correct < len(options)):
            continue
        validated.append(
            {
                "question": stem,
                "options": options,
                "correct_index": correct,
                "explanation": str(q.get("explanation", "")).strip(),
                "topic": str(q.get("topic", "")).strip() or None,
            }
        )
    return validated


async def generate_quiz(db, user_id: str, req: McqGenerateRequest) -> Quiz:
    context = await _context_from_request(db, user_id, req)
    if not context:
        raise ValueError(
            "You need to upload at least one document before generating a quiz. "
            "Go to the Documents tab and upload a PDF, DOCX or TXT file."
        )

    difficulty = DIFFICULTY_GUIDE.get(req.difficulty, DIFFICULTY_GUIDE["medium"])
    topic_instruction = (
        f"Focus the questions on the topic: '{req.topics.strip()}'." if req.topics and req.topics.strip() else ""
    )
    notes_instruction = (
        f"Additional guidance from the user: {req.notes.strip()}" if req.notes and req.notes.strip() else ""
    )

    prompt = (
        f"Create exactly {req.count} multiple-choice questions from the reference material below.\n"
        f"Difficulty: {req.difficulty} ({difficulty}).\n"
        f"{topic_instruction}\n{notes_instruction}\n"
        "Rules:\n"
        "- Each question must be answerable ONLY from the material.\n"
        "- Exactly 4 options per question (A–D). Only one correct.\n"
        "- Distractors must be plausible but clearly wrong.\n"
        "- correct_index must be 0-based (0–3).\n"
        "- Provide a concise explanation that quotes the material.\n"
        "- Return JSON of the form: {\"questions\": [{\"question\": str, \"options\": [str x4], "
        "\"correct_index\": int, \"explanation\": str, \"topic\": str}]}\n\n"
        "===== REFERENCE MATERIAL =====\n"
        f"{context}"
    )

    payload = await chat_json([{"role": "user", "content": prompt}], temperature=0.4, max_tokens=4000)
    questions = _validate_questions(payload)
    if not questions:
        raise ValueError("The model could not generate valid questions. Please try again.")

    title = (req.topics.strip() if req.topics else None) or "General quiz"
    quiz = Quiz(
        id=uuid.uuid4(),
        user_id=user_id,
        title=f"{title} — {req.difficulty}",
        difficulty=req.difficulty,
        config={
            "count": req.count,
            "difficulty": req.difficulty,
            "topics": req.topics,
            "document_ids": req.document_ids,
            "notes": req.notes,
        },
        questions=questions,
        status="pending",
        score=0,
        total=len(questions),
        answers=None,
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz


def get_quiz(db, user_id: str, quiz_id: str) -> Quiz | None:
    return db.execute(
        select(Quiz).where(Quiz.id == quiz_id, Quiz.user_id == user_id)
    ).scalar_one_or_none()


def sanitize_quiz(quiz: Quiz) -> dict:
    return {
        "id": str(quiz.id),
        "title": quiz.title,
        "difficulty": quiz.difficulty,
        "status": quiz.status,
        "score": quiz.score,
        "total": quiz.total,
        "created_at": quiz.created_at.isoformat(),
        "questions": [
            {"question": q["question"], "options": q["options"], "topic": q.get("topic")}
            for q in quiz.questions
        ],
    }


def submit_quiz(db, user_id: str, quiz_id: str, answers: list[int]) -> dict:
    quiz = get_quiz(db, user_id, quiz_id)
    if not quiz:
        raise KeyError("Quiz not found")
    if quiz.status == "submitted":
        raise ValueError("This quiz has already been submitted")

    results = []
    score = 0
    for i, question in enumerate(quiz.questions):
        selected = answers[i] if i < len(answers) else None
        correct = selected == question["correct_index"]
        if correct:
            score += 1
        results.append(
            {
                "question": question["question"],
                "options": question["options"],
                "selected": selected,
                "correct_index": question["correct_index"],
                "correct": correct,
                "explanation": question.get("explanation", ""),
                "topic": question.get("topic"),
            }
        )

    quiz.score = score
    quiz.total = len(quiz.questions)
    quiz.answers = answers
    quiz.status = "submitted"
    db.commit()

    total = quiz.total or 1
    passed = (score / total) * 100 >= 60
    return {
        "id": str(quiz.id),
        "score": score,
        "total": quiz.total,
        "passed": passed,
        "pass_percent": 60,
        "results": results,
    }
