from fastapi import APIRouter, Depends, HTTPException

from ..database import get_db
from ..schemas import McqGenerateRequest, McqOut, McqSubmitOut, McqSubmitRequest
from ..services import mcq
from .deps import require_service

router = APIRouter(prefix="/mcq", tags=["mcq"])


@router.post("/generate", response_model=McqOut, status_code=201)
async def generate(
    payload: McqGenerateRequest,
    user_id: str = Depends(require_service),
    db=Depends(get_db),
):
    try:
        quiz = await mcq.generate_quiz(db, user_id, payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Quiz generation failed: {exc}") from exc
    return mcq.sanitize_quiz(quiz)


@router.get("/{quiz_id}", response_model=McqOut)
def get_quiz(
    quiz_id: str,
    user_id: str = Depends(require_service),
    db=Depends(get_db),
):
    quiz = mcq.get_quiz(db, user_id, quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return mcq.sanitize_quiz(quiz)


@router.post("/{quiz_id}/submit", response_model=McqSubmitOut)
def submit(
    quiz_id: str,
    payload: McqSubmitRequest,
    user_id: str = Depends(require_service),
    db=Depends(get_db),
):
    try:
        return mcq.submit_quiz(db, user_id, quiz_id, payload.answers)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
