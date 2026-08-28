import { test as base } from "@playwright/test";
import { AuthService } from "../services/auth.service";

import { env } from "../../core/config/env";

export const test = base.extend<
  {}, // Test-scoped fixtures
  { adminToken: string; userToken: string } // Worker-scoped fixtures
>({
  adminToken: [
    async ({ playwright }, use) => {
      const requestContext = await playwright.request.newContext({
        baseURL: env.baseUrl,
      });
      const authService = new AuthService(requestContext);
      console.log("Creating admin token (worker scope)...");

      const credentials = {
        user: {
          username: env.User.admin.username,
          password: env.User.admin.password,
        },
      };

      const res = await authService.login(credentials);
      const token = (await res.json()).token;

      await use(token);
      await requestContext.dispose();
    },
    { scope: "worker" },
  ],

  userToken: [
    async ({ playwright }, use) => {
      const requestContext = await playwright.request.newContext({
        baseURL: env.baseUrl,
      });
      const authService = new AuthService(requestContext);
      console.log("Creating user token (worker scope)...");

      const credentials = {
        user: {
          username: env.User.normal.username,
          password: env.User.normal.password,
        },
      };

      const res = await authService.login(credentials);
      const token = (await res.json()).token;

      await use(token);
      await requestContext.dispose();
    },
    { scope: "worker" },
  ],
});