"""
Notification schemas for API serialization
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class NotificationBase(BaseModel):
    """Base notification schema"""
    title: str
    message: str
    type: str  # alert, recommendation, system
    farm_id: Optional[str] = None


class NotificationCreate(NotificationBase):
    """Notification creation schema"""
    user_id: str


class NotificationUpdate(BaseModel):
    """Notification update schema"""
    is_read: Optional[bool] = None


class NotificationInDB(NotificationBase):
    """Notification in database schema"""
    id: str
    user_id: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Notification(NotificationInDB):
    """Notification response schema"""
    pass


class NotificationStats(BaseModel):
    """Notification statistics schema"""
    total_notifications: int
    unread_notifications: int
    notifications_by_type: dict[str, int]
