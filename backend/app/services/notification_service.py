"""
Notification service for user notifications
"""

from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from app.models.notification import Notification
from app.schemas.notification import NotificationCreate, NotificationUpdate, NotificationStats


class NotificationService:
    """Notification service class"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_notification(self, notification_in: NotificationCreate) -> Notification:
        """Create new notification"""
        notification = Notification(
            user_id=notification_in.user_id,
            farm_id=notification_in.farm_id,
            title=notification_in.title,
            message=notification_in.message,
            type=notification_in.type
        )
        
        self.db.add(notification)
        await self.db.commit()
        await self.db.refresh(notification)
        
        return notification
    
    async def get_notification(self, notification_id: str) -> Optional[Notification]:
        """Get notification by ID"""
        result = await self.db.execute(
            select(Notification).where(Notification.id == notification_id)
        )
        return result.scalar_one_or_none()
    
    async def get_user_notifications(
        self, 
        user_id: str, 
        skip: int = 0, 
        limit: int = 50,
        unread_only: bool = False
    ) -> List[Notification]:
        """Get notifications for a user"""
        query = select(Notification).where(Notification.user_id == user_id)
        
        if unread_only:
            query = query.where(Notification.is_read == False)
        
        result = await self.db.execute(
            query
            .order_by(desc(Notification.created_at))
            .offset(skip)
            .limit(limit)
        )
        
        return result.scalars().all()
    
    async def update_notification(
        self, 
        notification_id: str, 
        notification_update: NotificationUpdate
    ) -> Optional[Notification]:
        """Update notification"""
        notification = await self.get_notification(notification_id)
        if not notification:
            return None
        
        update_data = notification_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(notification, field, value)
        
        await self.db.commit()
        await self.db.refresh(notification)
        
        return notification
    
    async def delete_notification(self, notification_id: str) -> bool:
        """Delete notification"""
        notification = await self.get_notification(notification_id)
        if not notification:
            return False
        
        await self.db.delete(notification)
        await self.db.commit()
        
        return True
    
    async def mark_all_notifications_read(self, user_id: str) -> int:
        """Mark all notifications as read for a user"""
        result = await self.db.execute(
            Notification.__table__.update()
            .where(
                Notification.user_id == user_id,
                Notification.is_read == False
            )
            .values(is_read=True)
        )
        
        await self.db.commit()
        return result.rowcount
    
    async def get_user_notification_stats(self, user_id: str) -> NotificationStats:
        """Get notification statistics for a user"""
        # Total notifications
        total_result = await self.db.execute(
            select(func.count(Notification.id))
            .where(Notification.user_id == user_id)
        )
        total_notifications = total_result.scalar()
        
        # Unread notifications
        unread_result = await self.db.execute(
            select(func.count(Notification.id))
            .where(
                Notification.user_id == user_id,
                Notification.is_read == False
            )
        )
        unread_notifications = unread_result.scalar()
        
        # Notifications by type
        type_result = await self.db.execute(
            select(
                Notification.type,
                func.count(Notification.id).label('count')
            )
            .where(Notification.user_id == user_id)
            .group_by(Notification.type)
        )
        notifications_by_type = {row.type: row.count for row in type_result.fetchall()}
        
        return NotificationStats(
            total_notifications=total_notifications or 0,
            unread_notifications=unread_notifications or 0,
            notifications_by_type=notifications_by_type
        )
