from fastapi import APIRouter, HTTPException
from app.schemas.family import FamilyCreate, FamilyResponse
from app.services.supabase_client import supabase

router = APIRouter()

@router.post("/", response_model=FamilyResponse)
async def create_family(family: FamilyCreate):
    try:
        result = (
            supabase
            .table("families")
            .insert(family.model_dump(exclude_none=True))
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=400, detail="Failed to create family")

        return result.data[0]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("")
def get_families():
    try:
        result = (
            supabase
            .table("families")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        return result.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{family_id}")
def get_family_by_id(family_id: str):
    try:
        result = (
            supabase
            .table("families")
            .select("*")
            .eq("id", family_id)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not result.data:
        raise HTTPException(status_code=404, detail="Family not found")

    return result.data[0]