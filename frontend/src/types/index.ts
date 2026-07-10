export interface User {
  id: number;
  full_name: string;
  username: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
  role: string;
  create_at?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface UsersResponse {
  success: boolean;
  users?: User[];
  message?: string;
}

export interface UserResponse {
  success: boolean;
  user?: User;
  message?: string;
}
