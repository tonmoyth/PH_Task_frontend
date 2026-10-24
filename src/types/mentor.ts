export interface Mentor {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  banned?: boolean;
  mustChangePassword: boolean;
  totalReviews?: number;
  reviewedSubmissionsCount?: number;
  createdAt: string;
  updatedAt?: string;
}
