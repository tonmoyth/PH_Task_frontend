import "server-only";
import { apiFetch } from "@/lib/api-client";
import {
  Submission,
  SubmissionStats,
  ReviewHistoryEntry,
} from "@/types/submission";
import { PaginatedResponse } from "@/types/api";

export interface CreateSubmissionPayload {
  projectName: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
}

export interface UpdateSubmissionPayload {
  projectName?: string;
  repoUrl?: string;
  liveUrl?: string;
  description?: string;
}

export interface ReviewSubmissionPayload {
  status: "APPROVED" | "REJECTED";
  reason?: string;
}

export async function createSubmissionService(
  payload: CreateSubmissionPayload,
): Promise<Submission> {
  const res = await apiFetch<Submission>("/api/submissions", {
    method: "POST",
    body: payload,
  });
  return res.data;
}

export async function getMySubmissionsService(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<PaginatedResponse<Submission>> {
  const res = await apiFetch<PaginatedResponse<Submission>>(
    "/api/submissions/mine",
    {
      method: "GET",
      searchParams: {
        page: params?.page,
        limit: params?.limit,
        status: params?.status,
      },
    },
  );
  return res.data;
}

export async function getMySubmissionByIdService(
  id: string,
): Promise<Submission> {
  const res = await apiFetch<Submission>(`/api/submissions/mine/${id}`, {
    method: "GET",
  });
  return res.data;
}

export async function updateAndResubmitService(
  id: string,
  payload: UpdateSubmissionPayload,
): Promise<Submission> {
  const res = await apiFetch<Submission>(`/api/submissions/mine/${id}`, {
    method: "PATCH",
    body: payload,
  });
  return res.data;
}

export async function withdrawSubmissionService(id: string): Promise<void> {
  await apiFetch<void>(`/api/submissions/mine/${id}`, {
    method: "DELETE",
  });
}

export async function getAllSubmissionsService(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<PaginatedResponse<Submission>> {
  const res = await apiFetch<PaginatedResponse<Submission>>(
    "/api/submissions",
    {
      method: "GET",
      searchParams: {
        page: params?.page,
        limit: params?.limit,
        status: params?.status,
        search: params?.search,
      },
    },
  );
  return res.data;
}

export async function getSubmissionStatsService(): Promise<SubmissionStats> {
  const res = await apiFetch<SubmissionStats>("/api/submissions/stats", {
    method: "GET",
  });
  return res.data;
}

export async function getSubmissionByIdService(id: string): Promise<Submission> {
  const res = await apiFetch<Submission>(`/api/submissions/${id}`, {
    method: "GET",
  });
  return res.data;
}

export async function reviewSubmissionService(
  id: string,
  payload: ReviewSubmissionPayload,
): Promise<Submission> {
  const res = await apiFetch<Submission>(`/api/submissions/${id}/review`, {
    method: "PATCH",
    body: payload,
  });
  return res.data;
}

export async function getSubmissionHistoryService(
  id: string,
): Promise<ReviewHistoryEntry[]> {
  try {
    const res = await apiFetch<ReviewHistoryEntry[]>(
      `/api/submissions/${id}/history`,
      {
        method: "GET",
      },
    );
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
  }
}
