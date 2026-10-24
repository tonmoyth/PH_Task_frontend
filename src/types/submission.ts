export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface SubmissionStudent {
  id: string;
  name: string;
  email: string;
}

export interface SubmissionReviewer {
  id: string;
  name: string;
}

export interface Submission {
  id: string;
  projectName: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
  status: SubmissionStatus;
  rejectionReason?: string | null;
  resubmitCount: number;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  student?: SubmissionStudent | null;
  studentId?: string;
  reviewedBy?: SubmissionReviewer | null;
  reviewedById?: string | null;
}

export interface SubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface ReviewHistoryEntry {
  id: string;
  submissionId: string;
  reviewerId: string;
  status: SubmissionStatus;
  reason?: string | null;
  createdAt: string;
  reviewer?: {
    id: string;
    name: string;
    email?: string;
  } | null;
}
