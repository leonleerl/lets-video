from fastapi import APIRouter, HTTPException
from app.schemas.memory_summary import MemorySummaryCreate, MemorySummaryUpdate
from app.services.supabase_client import supabase

router = APIRouter(tags=["Memory Summaries"])


@router.post("")
def create_memory_summary(memory: MemorySummaryCreate):
    try:
        result = (
            supabase
            .table("memory_summaries")
            .insert(memory.model_dump(exclude_none=True))
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=400, detail="Failed to create memory summary")

        return result.data[0]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{video_id}/memory-summary")
def get_memory_summary_by_video_id(video_id: str):
    try:
        result = (
            supabase
            .table("memory_summaries")
            .select("*")
            .eq("video_id", video_id)
            .execute()
        )

        return result.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{family_id}/memory-summaries")
def get_memory_summaries_by_family_id(family_id: str):
    try:
        result = (
            supabase
            .table("memory_summaries")
            .select("*")
            .eq("family_id", family_id)
            .order("created_at", desc=True)
            .execute()
        )

        return result.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{summary_id}")
def update_memory_summary(summary_id: str, memory: MemorySummaryUpdate):
    try:
        update_data = memory.model_dump(exclude_none=True)

        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        result = (
            supabase
            .table("memory_summaries")
            .update(update_data)
            .eq("id", summary_id)
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="Memory summary not found")

        return result.data[0]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{summary_id}")
def delete_memory_summary(summary_id: str):
    try:
        result = (
            supabase
            .table("memory_summaries")
            .delete()
            .eq("id", summary_id)
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="Memory summary not found")

        return {"message": "Memory summary deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))