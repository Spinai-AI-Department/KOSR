# Admin User Approval System Plan

## Context

Currently, KSOR has no signup flow — users can only be created by admins via the backend. There is no admin page in the frontend at all. The goal is to:
1. Allow new users to **self-register** (signup), with their account in a **pending** state
2. Build a **separate admin page** where ADMIN/STEERING users can **approve or reject** pending signups
3. Block pending/rejected users from logging in with clear error messages

## Design Decision: New `approval_status` column

Add a dedicated `auth.signup_status` enum (`PENDING`, `APPROVED`, `REJECTED`) rather than reusing `is_active`. Rationale:
- `is_active` already means "admin deactivated an existing user" — overloading it conflates two states
- Self-registered users get `is_active=false` + `approval_status='PENDING'` (belt-and-suspenders: existing login check blocks them even if approval check is missed)
- Default is `'APPROVED'` so all existing users and admin-created users are unaffected

---

## Phase 1: DB Engineer

### 1.1 New enum type
```sql
CREATE TYPE auth.signup_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
```

### 1.2 New columns on `auth.user_account`
```sql
ALTER TABLE auth.user_account
  ADD COLUMN approval_status  auth.signup_status NOT NULL DEFAULT 'APPROVED',
  ADD COLUMN approved_by      uuid REFERENCES auth.user_account(user_id),
  ADD COLUMN approved_at      timestamptz,
  ADD COLUMN rejection_reason text;
```

### 1.3 Partial index for pending queries
```sql
CREATE INDEX idx_user_account_approval_pending
  ON auth.user_account (approval_status, created_at DESC)
  WHERE approval_status = 'PENDING' AND deleted_at IS NULL;
```

### 1.4 Update `auth.get_user_auth_snapshot()` function
- Add `approval_status` to `RETURNS TABLE` and `SELECT` clause
- File: `server/database/ksor_schema.sql` ~line 804

### 1.5 Update guard trigger `auth.tg_guard_user_account_update`
- Add `approval_status` to the guarded column list (~line 794)

### 1.6 RLS policy for public signup INSERT
- Add policy allowing SYSTEM context to insert users only with `approval_status='PENDING'` and `is_active=false`

---

## Phase 2: Backend Engineer

### 2.1 New models — `server/app/models/auth.py`
- `SignupRequest`: login_id, password, password_confirm, full_name, email, phone, hospital_code, role_code, department, specialty, license_number

### 2.2 Signup service — `server/app/services/auth_service.py`
- New `signup()` function: validate passwords match, check duplicate login_id/email, hash password, INSERT with `is_active=false`, `approval_status='PENDING'`
- Uses `get_db_auth` (SYSTEM context) since it's a public endpoint

### 2.3 Public signup endpoint — `server/app/api/routes/auth.py`
- `POST /auth/signup` — no auth required, returns confirmation message

### 2.4 Modify login — `server/app/services/auth_service.py`
- Check `approval_status` BEFORE `is_active` check to give specific error messages:
  - `PENDING` → "회원가입 승인 대기 중입니다" (`AUTH_PENDING_APPROVAL`)
  - `REJECTED` → "회원가입이 거절되었습니다" (`AUTH_SIGNUP_REJECTED`)

### 2.5 Admin approval endpoints — `server/app/api/routes/admin.py`
- `GET /admin/users/pending` — list pending users (paginated)
- `PUT /admin/users/{user_id}/approve` — set `approval_status='APPROVED'`, `is_active=true`
- `PUT /admin/users/{user_id}/reject` — set `approval_status='REJECTED'` with optional reason

### 2.6 Admin service functions — `server/app/services/admin_service.py`
- `list_pending_users()`, `approve_user()`, `reject_user()`

### 2.7 Update admin models — `server/app/models/admin.py`
- Add `approval_status` to `AdminUserItem`
- New `AdminRejectUserRequest` model with optional `reason`

### 2.8 Hospital list endpoint (for signup dropdown)
- `GET /auth/hospitals` — public endpoint returning hospital code/name list from `ref.hospital`

---

## Phase 3: Frontend Engineer

### 3.1 New API service — `web/src/api/admin.ts`
- `listPendingUsers()`, `approveUser()`, `rejectUser()`, `listUsers()`
- Add `signup()` to `web/src/api/auth.ts`

### 3.2 Signup page — `web/src/pages/SignupPage.tsx`
- Same two-panel layout as LoginPage
- Form fields: 아이디, 비밀번호, 비밀번호 확인, 이름, 이메일, 전화번호, 소속 병원 (dropdown), 역할 (PI/CRC only), 진료과, 전문분야, 면허번호
- Success → show message "관리자 승인 후 로그인할 수 있습니다" + link to login
- Use shadcn/ui components (Input, Select, Button, Label)

### 3.3 Admin page — `web/src/pages/admin/AdminUsersPage.tsx`
- **Tab 1: "승인 대기"** (default) — table of pending users with 승인/거절 buttons, rejection dialog with reason field
- **Tab 2: "전체 사용자"** — full user list with pagination, status badges, row actions (edit, reset password, deactivate)
- Use shadcn `Tabs`, `Table`, `Badge`, `Dialog`, `DropdownMenu`

### 3.4 Update router — `web/src/router.tsx`
- Public: `{ path: "/signup", Component: SignupPage }`
- Protected (inside Layout): `{ path: "admin/users", Component: AdminUsersPage }`

### 3.5 Update Layout sidebar — `web/src/components/common/Layout.tsx`
- Add role-based nav: show "사용자 관리" (`/admin/users`) only for ADMIN/STEERING roles
- Import `Shield` or `UserCog` icon from lucide-react

### 3.6 Update LoginPage — `web/src/pages/LoginPage.tsx`
- Add "계정이 없으신가요? 회원가입" link below login form, linking to `/signup`

### 3.7 Login error handling
- Verify that `AUTH_PENDING_APPROVAL` and `AUTH_SIGNUP_REJECTED` error messages from backend propagate correctly to the login form

---

## Key Files to Modify

| File | Changes |
|------|---------|
| `server/database/ksor_schema.sql` | New enum, columns, index, updated function/trigger/RLS |
| `server/app/models/auth.py` | SignupRequest model |
| `server/app/models/admin.py` | AdminRejectUserRequest, updated AdminUserItem |
| `server/app/services/auth_service.py` | signup(), updated login() |
| `server/app/services/admin_service.py` | list_pending_users(), approve_user(), reject_user() |
| `server/app/api/routes/auth.py` | POST /auth/signup, GET /auth/hospitals |
| `server/app/api/routes/admin.py` | GET pending, PUT approve, PUT reject |
| `web/src/api/auth.ts` | signup(), getHospitals() |
| `web/src/api/admin.ts` | New file — admin API service |
| `web/src/api/index.ts` | Re-export adminService |
| `web/src/pages/SignupPage.tsx` | New signup page |
| `web/src/pages/admin/AdminUsersPage.tsx` | New admin page |
| `web/src/router.tsx` | Add /signup and /admin/users routes |
| `web/src/components/common/Layout.tsx` | Role-based nav items |
| `web/src/pages/LoginPage.tsx` | Add signup link |

---

## Verification

1. **Signup flow**: Register a new user → verify they appear in DB with `approval_status='PENDING'`, `is_active=false` → try to login → should see "승인 대기" error
2. **Admin approval**: Login as admin → navigate to /admin/users → see pending user in "승인 대기" tab → click 승인 → verify `approval_status='APPROVED'`, `is_active=true` in DB → user can now login
3. **Admin rejection**: Reject a pending user with reason → verify they see "거절" error on login attempt
4. **Existing users unaffected**: All existing users should have `approval_status='APPROVED'` by default and login normally
5. **Admin-created users**: Users created via admin panel should still be immediately active (default `APPROVED`)
6. **Nav visibility**: Non-admin users should NOT see "사용자 관리" in sidebar
