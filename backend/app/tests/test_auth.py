"""
Tests for authentication endpoints
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.main import app
from app.core.database import get_db
from app.models.user import User
from app.core.security import get_password_hash

client = TestClient(app)


@pytest.fixture
async def test_user(db: AsyncSession):
    """Create a test user"""
    user = User(
        name="Test User",
        email="test@example.com",
        password_hash=get_password_hash("testpassword"),
        role="farmer"
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


class TestAuth:
    """Test authentication endpoints"""
    
    async def test_register_success(self, db: AsyncSession):
        """Test successful user registration"""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "name": "New User",
                "email": "newuser@example.com",
                "password": "newpassword123",
                "role": "farmer"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "newuser@example.com"
        assert data["name"] == "New User"
        assert data["role"] == "farmer"
        assert "id" in data
    
    async def test_register_duplicate_email(self, db: AsyncSession, test_user: User):
        """Test registration with duplicate email"""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "name": "Another User",
                "email": "test@example.com",
                "password": "password123",
                "role": "farmer"
            }
        )
        
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"]
    
    async def test_login_success(self, db: AsyncSession, test_user: User):
        """Test successful login"""
        response = client.post(
            "/api/v1/auth/login-email",
            json={
                "email": "test@example.com",
                "password": "testpassword"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    async def test_login_invalid_credentials(self, db: AsyncSession):
        """Test login with invalid credentials"""
        response = client.post(
            "/api/v1/auth/login-email",
            json={
                "email": "nonexistent@example.com",
                "password": "wrongpassword"
            }
        )
        
        assert response.status_code == 401
        assert "Incorrect email or password" in response.json()["detail"]
    
    async def test_get_current_user(self, db: AsyncSession, test_user: User):
        """Test getting current user info"""
        # First login to get token
        login_response = client.post(
            "/api/v1/auth/login-email",
            json={
                "email": "test@example.com",
                "password": "testpassword"
            }
        )
        
        token = login_response.json()["access_token"]
        
        # Use token to get user info
        response = client.get(
            "/api/v1/users/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["name"] == "Test User"
