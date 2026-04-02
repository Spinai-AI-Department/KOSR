import { api } from './client'

export interface PendingUser {
  user_id: string
  login_id: string
  full_name: string
  hospital_code: string | null
  role_code: string
  email: string | null
  phone: string | null
  is_active: boolean
  is_locked: boolean
  is_first_login: boolean
  approval_status: string
  created_at: string
  last_login_at: string | null
}

export interface AdminUserListResponse {
  pagination: {
    current_page: number
    total_pages: number
    total_elements: number
    page_size: number
  }
  items: PendingUser[]
}

export interface RejectUserRequest {
  reason?: string
}

export const adminService = {
  listPendingUsers: (token: string, page = 1, size = 20): Promise<AdminUserListResponse> =>
    api.get<AdminUserListResponse>(`/admin/users/pending?page=${page}&size=${size}`, token),

  approveUser: (userId: string, token: string): Promise<unknown> =>
    api.put<unknown>(`/admin/users/${userId}/approve`, {}, token),

  rejectUser: (userId: string, payload: RejectUserRequest, token: string): Promise<unknown> =>
    api.put<unknown>(`/admin/users/${userId}/reject`, payload, token),

  listUsers: (token: string, page = 1, size = 20, keyword?: string): Promise<AdminUserListResponse> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) })
    if (keyword) params.set('keyword', keyword)
    return api.get<AdminUserListResponse>(`/admin/users?${params}`, token)
  },
}
