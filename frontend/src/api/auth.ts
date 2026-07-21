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
  const payload = { ...user };
  if (payload.phone === "") delete payload.phone;
  if (payload.email === "") delete payload.email;

  const response = await apiClient("/auth/register", {
    method: "POST",
    body: JSON.stringify({ user: payload }),
  });
  return response.json();
};
