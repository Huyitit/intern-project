import { toast } from "react-toastify";
import { getToken, logout } from "../utils/auth";

const BASE_URL = "http://localhost:3000/api";

export async function apiClient(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();

  const headers = new Headers(options.headers || {});
  
  if (!(options.body instanceof FormData)) {
    console.log("body is not an instance of FormData");
    headers.set("Content-Type", "application/json");
  }
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  console.log("options.body", options.body);
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401 || response.status === 403) {
      if (endpoint !== "/auth/login" && endpoint !== "/auth/register") {
        toast.error("Session expired or unauthorized. Please log in again.");
        logout();
        throw new Error("Unauthorized");
      }
    }

    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      throw error;
    }
    toast.error("Network error. Please try again later.");
    throw error;
  }
}
