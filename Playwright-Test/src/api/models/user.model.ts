

export interface User {
  id?: number,
  full_name?: string,
  username: string,
  phone?: string,
  email?: string,
  password: string
  role?: 'admin' | 'user',
  create_at?: Date,
}

export interface LoginRequest {
  user:
  {
    username: string,
    password: string
  }
}

export interface RegisterRequest {
  user: {
    full_name: string,
    username: string,
    password: string,
    phone: string,
    email: string,
    role: 'user',
  }
}