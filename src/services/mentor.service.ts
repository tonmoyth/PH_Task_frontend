import "server-only";
import { apiFetch } from "@/lib/api-client";
import { Mentor } from "@/types/mentor";
import { PaginatedResponse } from "@/types/api";

export interface CreateMentorPayload {
  name: string;
  email: string;
}

interface RawMentor {
  id: string;
  name: string;
  email: string;
  role?: string;
  isActive?: boolean;
  banned?: boolean;
  mustChangePassword?: boolean;
  totalReviews?: number;
  _count?: { reviewedSubmissions?: number };
  createdAt: string;
  updatedAt?: string;
}

export async function createMentorService(
  payload: CreateMentorPayload,
): Promise<Mentor> {
  const res = await apiFetch<Mentor>("/api/admin/mentors", {
    method: "POST",
    body: payload,
  });
  return res.data;
}

export async function getMentorsService(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedResponse<Mentor>> {
  const res = await apiFetch<PaginatedResponse<RawMentor>>("/api/admin/mentors", {
    method: "GET",
    searchParams: {
      page: params?.page,
      limit: params?.limit,
      search: params?.search,
      searchTerm: params?.search,
    },
  });

  // Adapt items
  const items = (res.data?.data || []).map((m: RawMentor) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    role: m.role || "MENTOR",
    isActive: m.isActive !== false && !m.banned,
    banned: Boolean(m.banned || m.isActive === false),
    mustChangePassword: Boolean(m.mustChangePassword),
    totalReviews: m.totalReviews ?? m._count?.reviewedSubmissions ?? 0,
    reviewedSubmissionsCount: m.totalReviews ?? m._count?.reviewedSubmissions ?? 0,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  }));

  return {
    data: items,
    total: res.data?.total ?? items.length,
    page: res.data?.page ?? 1,
    totalPages: res.data?.totalPages ?? 1,
  };
}

export async function getMentorByIdService(id: string): Promise<Mentor> {
  const res = await apiFetch<RawMentor>(`/api/admin/mentors/${id}`, {
    method: "GET",
  });
  const m = res.data;
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    role: m.role || "MENTOR",
    isActive: m.isActive !== false && !m.banned,
    banned: Boolean(m.banned || m.isActive === false),
    mustChangePassword: Boolean(m.mustChangePassword),
    totalReviews: m.totalReviews ?? m._count?.reviewedSubmissions ?? 0,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  };
}

export async function updateMentorStatusService(
  id: string,
  isActive: boolean,
): Promise<Mentor> {
  // Try PATCH /api/admin/mentors/:id
  try {
    const res = await apiFetch<Mentor>(`/api/admin/mentors/${id}`, {
      method: "PATCH",
      body: { isActive },
    });
    return res.data;
  } catch {
    // If not found, try Better Auth ban-user / unban-user
    const endpoint = isActive ? "/api/auth/admin/unban-user" : "/api/auth/admin/ban-user";
    const body = isActive ? { userId: id } : { userId: id, banReason: "Deactivated by admin" };
    const res = await apiFetch<Mentor>(endpoint, {
      method: "POST",
      body,
    });
    return res.data;
  }
}

export async function resetMentorPasswordService(id: string): Promise<void> {
  await apiFetch<void>(`/api/admin/mentors/${id}/reset-password`, {
    method: "POST",
  });
}
