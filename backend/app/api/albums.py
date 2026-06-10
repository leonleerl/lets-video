from fastapi import APIRouter, HTTPException
from app.schemas.album import AlbumCreate, AlbumUpdate
from app.services.supabase_client import supabase

router = APIRouter()


@router.post("")
def create_album(album: AlbumCreate):
    try:
        result = (
            supabase
            .table("albums")
            .insert(album.model_dump(exclude_none=True))
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=400, detail="Failed to create album")

        return result.data[0]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("")
def get_albums():
    try:
        result = (
            supabase
            .table("albums")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        return result.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{album_id}")
def get_album_by_id(album_id: str):
    try:
        result = (
            supabase
            .table("albums")
            .select("*")
            .eq("id", album_id)
            .single()
            .execute()
        )

        return result.data

    except Exception:
        raise HTTPException(status_code=404, detail="Album not found")


@router.get("/family/{family_id}")
def get_albums_by_family_id(family_id: str):
    try:
        result = (
            supabase
            .table("albums")
            .select("*")
            .eq("family_id", family_id)
            .order("created_at", desc=True)
            .execute()
        )

        return result.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{album_id}")
def update_album(album_id: str, album: AlbumUpdate):
    try:
        update_data = album.model_dump(exclude_none=True)

        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        result = (
            supabase
            .table("albums")
            .update(update_data)
            .eq("id", album_id)
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="Album not found")

        return result.data[0]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{album_id}")
def delete_album(album_id: str):
    try:
        result = (
            supabase
            .table("albums")
            .delete()
            .eq("id", album_id)
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="Album not found")

        return {"message": "Album deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))