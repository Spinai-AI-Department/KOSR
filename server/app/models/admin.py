from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import EmailStr, Field

from app.models.common import APIModel, PaginationMeta


class AdminUserCreateRequest(APIModel):
    login_id: str = Field(min_length=3, max_length=100)
    full_name: str = Field(min_length=2, max_length=100)
    hospital_code: str | None = Field(default=None, max_length=20)
    role_code: str
    email: EmailStr | None = None
    phone: str | None = None
    initial_password: str | None = Field(default=None, min_length=8, max_length=128)


class AdminUserUpdateRequest(APIModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=100)
    hospital_code: str | None = Field(default=None, max_length=20)
    role_code: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    is_active: bool | None = None
    is_locked: bool | None = None
    password_reset_required: bool | None = None


class AdminResetPasswordRequest(APIModel):
    initial_password: str | None = Field(default=None, min_length=8, max_length=128)


class AdminRejectUserRequest(APIModel):
    reason: str | None = None


class AdminUserItem(APIModel):
    user_id: UUID
    login_id: str
    full_name: str
    hospital_code: str | None = None
    role_code: str
    email: str | None = None
    phone: str | None = None
    is_active: bool
    is_locked: bool
    is_first_login: bool
    approval_status: str
    created_at: datetime
    last_login_at: datetime | None = None


class AdminUserListResponse(APIModel):
    pagination: PaginationMeta
    items: list[AdminUserItem]


class ApprovalLogItem(APIModel):
    action: str          # 가입 신청 | 승인 | 거절
    user_id: UUID
    login_id: str
    full_name: str
    hospital_code: str | None = None
    role_code: str
    acted_at: datetime
    actor_name: str | None = None   # 승인/거절한 관리자 이름
    rejection_reason: str | None = None
