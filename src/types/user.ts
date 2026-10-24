export type Role = "student" | "mentor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  mustChangePassword: boolean;
  banned?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
}

export interface SessionResponse {
  session?: Session | null;
  user?: User | null;
}
