export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  emailVerified: boolean;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    emailVerified: boolean;
  };
  requiresVerification: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}
