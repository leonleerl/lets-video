from fastapi import APIRouter, HTTPException
from app.schemas.video_tag import VideoTagCreate
from app.services.supabase_client import supabase

router = APIRouter(tags=["Video Tags"])


@router.post("/{video_id}/tags")
def create_video_tag(video_id: str, video_tag: VideoTagCreate):
    try:
        data = {
            "video_id": video_id,
            "tag": video_tag.tag.strip()
        }

        result = (
            supabase
            .table("video_tags")
            .insert(data)
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=400, detail="Failed to create video tag")

        return result.data[0]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{video_id}/tags")
def get_video_tags(video_id: str):
    try:
        result = (
            supabase
            .table("video_tags")
            .select("*")
            .eq("video_id", video_id)
            .execute()
        )

        return result.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{tag_id}")
def delete_video_tag(tag_id: str):
    try:
        result = (
            supabase
            .table("video_tags")
            .delete()
            .eq("id", tag_id)
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="Video tag not found")

        return {"message": "Video tag deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))