import { test as base} from "@playwright/test";
import { AuthService } from "../../services/auth.service";
import { AuthClient } from "../../clients/auth.client";


export const test = base.extend<{adminToken: string, userToken: string}>({
  adminToken: async ({request}, use)=>{
    const apiClient = new AuthClient(request);
    const authService = new AuthService(apiClient);

    let token: string;

    const credentials = {
      user: 
      {
        username: process.env.ADMIN_USERNAME || "admin123",
        password: process.env.ADMIN_PASSWORD || "admin123"
      }
    }

    const res = await authService.login(credentials)
    token = (await res.json()).token;

    await use(token);
  },

  userToken: async ({request}, use)=>{
    const apiClient = new AuthClient(request);
    const authService = new AuthService(apiClient);

    let token: string;

    const credentials = {
      user: 
      {
        username: process.env.USER_USERNAME || "username01",
        password: process.env.USER_PASSWORD || "userpassword1"
      }
    }

    const res = await authService.login(credentials)
    token = (await res.json()).token;

    await use(token);
  }
});