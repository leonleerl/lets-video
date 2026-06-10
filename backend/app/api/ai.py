from fastapi import APIRouter, HTTPException
from app.schemas.ai import AnalyzeVideoRequest
from app.agents.memory_agent import analyse_video_memory

router = APIRouter(tags=["AI"])


@router.post("/{video_id}/analyse-memory")
def analyse_memory(video_id: str, request: AnalyzeVideoRequest):
    try:
        return analyse_video_memory(
            video_id=video_id,
            language=request.language or "en"
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))