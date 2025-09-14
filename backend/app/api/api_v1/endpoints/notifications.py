"""
Notification endpoints
"""

from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.user import User
from app.schemas.notification import Notification, NotificationUpdate, NotificationStats
from app.services.notification_service import NotificationService

router = APIRouter()


@router.get("/", response_model=List[Notification])
async def get_user_notifications(
    skip: int = 0,
    limit: int = 50,
    unread_only: bool = False,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get notifications for current user"""
    notification_service = NotificationService(db)
    
    notifications = await notification_service.get_user_notifications(
        user_id=str(current_user.id),
        skip=skip,
        limit=limit,
        unread_only=unread_only
    )
    
    return notifications


@router.get("/stats", response_model=NotificationStats)
async def get_notification_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get notification statistics for current user"""
    notification_service = NotificationService(db)
    
    stats = await notification_service.get_user_notification_stats(
        user_id=str(current_user.id)
    )
    
    return stats


@router.put("/{notification_id}", response_model=Notification)
async def update_notification(
    notification_id: str,
    notification_update: NotificationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Update notification (mark as read/unread)"""
    notification_service = NotificationService(db)
    
    # Check if notification exists and belongs to user
    notification = await notification_service.get_notification(notification_id)
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    if notification.user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    updated_notification = await notification_service.update_notification(
        notification_id=notification_id,
        notification_update=notification_update
    )
    
    return updated_notification


@router.put("/mark-all-read")
async def mark_all_notifications_read(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Mark all notifications as read for current user"""
    notification_service = NotificationService(db)
    
    await notification_service.mark_all_notifications_read(
        user_id=str(current_user.id)
    )
    
    return {"message": "All notifications marked as read"}


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Delete a notification"""
    notification_service = NotificationService(db)
    
    # Check if notification exists and belongs to user
    notification = await notification_service.get_notification(notification_id)
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    if notification.user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    await notification_service.delete_notification(notification_id)
    
    return {"message": "Notification deleted successfully"}
