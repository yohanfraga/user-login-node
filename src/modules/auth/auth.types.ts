export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  token: string;
}

export interface JwtPayload {
  name: string;
  userId: string;
  email: string;
  roles: string[];
} 