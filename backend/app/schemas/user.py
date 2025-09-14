"""
User schemas for API serialization
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole


class UserBase(BaseModel):
    """Base user schema"""
    name: str
    email: EmailStr
    phone: Optional[str] = None
    role: UserRole = UserRole.FARMER
    region: Optional[str] = None
    language: str = "en"


class UserCreate(UserBase):
    """User creation schema"""
    password: str


class UserUpdate(BaseModel):
    """User update schema"""
    name: Optional[str] = None
    phone: Optional[str] = None
    region: Optional[str] = None
    language: Optional[str] = None
    is_active: Optional[bool] = None


class UserInDB(UserBase):
    """User in database schema"""
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class User(UserInDB):
    """User response schema"""
    pass


class UserLogin(BaseModel):
    """User login schema"""
    email: EmailStr
    password: str


class Token(BaseModel):
    """Token response schema"""
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """Token payload schema"""
    sub: Optional[str] = None
