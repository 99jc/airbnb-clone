from fastapi import APIRouter, Depends, Response, status, HTTPException, Request
from fastapi.responses import RedirectResponse
from typing import Annotated
from .auth import get_current_active_user
from .. import models
from sqlalchemy.orm import Session
from ..database import get_db
from ..schema import User, Tag, RoomType
import uuid

router = APIRouter(
    prefix="/api/hosting",
    tags=["hosting"]
)

@router.post("/create")
async def createHosting(response: Response, db: Annotated[Session, Depends(get_db)], current_user: Annotated[User, Depends(get_current_active_user)]):
    newHostingId = str(uuid.uuid4())
    newHosting = models.Place(id = newHostingId, host = current_user.id)
    db.add(newHosting)
    db.commit()
    return { "message": "success", "hostingId": newHostingId }

@router.patch("/{hostingId}/tag", status_code=status.HTTP_200_OK)
async def updateTag(response: Response, hostingId: str, data: Tag, db: Annotated[Session, Depends(get_db)], current_user: Annotated[User, Depends(get_current_active_user)]):
    hosting = db.query(models.Place).filter(models.Place.id == hostingId).first()
    if not hosting:
        response.status_code = status.HTTP_404_NOT_FOUND
        return { "message": f"{hostingId} not found!" }
    hosting.tag = data.tag
    db.commit()
    return { "message": "tag successfully changed" }


@router.patch("/{hostingId}/roomType", status_code=status.HTTP_200_OK)
async def updateTag(response: Response, hostingId: str, data: RoomType, db: Annotated[Session, Depends(get_db)], current_user: Annotated[User, Depends(get_current_active_user)]):
    hosting = db.query(models.Place).filter(models.Place.id == hostingId).first()
    if not hosting:
        response.status_code = status.HTTP_404_NOT_FOUND
        return { "message": f"{hostingId} not found!" }
    hosting.roomType = data.type
    db.commit()
    return { "message": "tag successfully changed" }