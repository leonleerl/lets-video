from fastapi import APIRouter, HTTPException
from app.schemas.video import VideoCreate
from app.services.supabase_client import supabase

router = APIRouter(tags=["Videos"])


@router.post("")
def create_video(video: VideoCreate):
    try:
        result = (
            supabase
            .table("videos")
            .insert(video.model_dump(exclude_none=True))
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=400, detail="Failed to create video")

        return result.data[0]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/album/{album_id}")
def get_videos_by_album_id(album_id: str):
    try:
        result = (
            supabase
            .table("videos")
            .select("*")
            .eq("album_id", album_id)
            .order("created_at", desc=True)
            .execute()
        )

        return result.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{video_id}")
def get_video_by_id(video_id: str):
    try:
        result = (
            supabase
            .table("videos")
            .select("*")
            .eq("id", video_id)
            .single()
            .execute()
        )

        return result.data

    except Exception:
        raise HTTPException(status_code=404, detail="Video not found")