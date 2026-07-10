import { apiClient } from "./client";
import { type AuthResponse } from "../types/index";

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      user: {
        username,
        password,
      }
    }),
  });
  return response.json();
};

export const registerUser = async (user: any): Promise<AuthResponse> => {
  const response = await apiClient("/auth/register", {
    method: "POST",
    body: JSON.stringify({ user }),
  });
  return response.json();
};
