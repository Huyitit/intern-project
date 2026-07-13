import { apiClient } from "./client";
import { type User, type UsersResponse, type UserResponse } from "../types";
import { getUser } from "../utils/auth";

export const getUsers = async (
  page: number = 1,
  limit: number = 10,
  keyword: string = "",
  sort: string = "id",
  order: string = "asc"
): Promise<UsersResponse> => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    keyword,
    sortBy: sort, 
    order,
  }).toString();
  console.log(query);
  const response = await apiClient(`/users?${query}`, {
    method: "GET",
  });
  return response.json();
};

export const getUserById = async (id: number): Promise<UserResponse> => {
  const response = await apiClient(`/users/${id}`, {
    method: "GET",
  });
  return response.json();
};

export const createUser = async (user: any): Promise<UserResponse> => {
  const response = await apiClient("/users", {
    method: "POST",
    body: JSON.stringify({ user }),
  });
  return response.json();
};

export const updateUser = async (id: number, user: any): Promise<UserResponse> => {
  const response = await apiClient(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify({ user }),
  });
  return response.json();
};

export const deleteUser = async (id: number): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient(`/users/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

// Intentionally slow endpoint for dev testing as per R8 requirement
export const exportUsersSlow = async (): Promise<UsersResponse> => {
  const response = await apiClient(`/users/export`, {
    method: "GET",
  });
  return response.json();
};

export const uploadAvatar = async (file: File): Promise<{ success: boolean; message: string; avatar_url?: string }> => {
  const user = getUser();
  const id = user?.id;
  
  const formData = new FormData();
  formData.append("avatar", file);
  
  const response = await apiClient(`/users/${id}/avatar`, {
    method: "PUT",
    body: formData,
  });
  
  return response.json();
};

export const updateProfileByCSV = async (id: number, file: File): Promise<UserResponse> => {
  const formData = new FormData();
  formData.append("csv", file);
  
  const response = await apiClient(`/users/${id}/csv`, {
    method: "POST",
    body: formData,
  });
  
  return response.json();
};
