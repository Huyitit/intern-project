import { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseService } from "./base.service";
import { User, LoginRequest, RegisterRequest } from "../models/user.model";
import { endpoints } from "../../core/config/endpoints";
import { UserBuilder } from "../../data/builders/user.builder";
import { pool } from "../../core/config/db";

export interface TargetUserInfo {
  userId: number;
  token: string;
  username: string;
}

export class AuthService extends BaseService<User> {
  constructor(request: APIRequestContext) {
    super(request, '');
  }

  async login(credentials: LoginRequest): Promise<APIResponse> {
    return this.post(endpoints.login, credentials);
  }

  async register(payload: any, options: any = {}): Promise<APIResponse> {
    return this.post(endpoints.register, payload, options);
  }

  /**
   * Registers a new valid user and logs them in, returning their userId, session token, and username.
   */
  async createTargetUser(): Promise<TargetUserInfo> {
    const newUser = new UserBuilder().setValidNewUser().build();
    const registerRes = await this.register({ user: newUser });
    const userId = (await registerRes.json()).user.id;

    const loginRes = await this.login({
      user: { username: newUser.username, password: newUser.password },
    });
    const token = (await loginRes.json()).token;

    return { userId, token, username: newUser.username };
  }

  /**
   * Registers a new valid admin user and logs them in, returning their userId, session token, and username.
   */
  async createTargetAdmin(): Promise<TargetUserInfo> {
    const newUser = new UserBuilder().setValidNewUser().setRole('admin').build();
    const registerRes = await this.register({ user: newUser });
    const userId = (await registerRes.json()).user.id;

    await pool.execute('UPDATE users SET role = ? WHERE id = ?', ['admin', userId]);

    const loginRes = await this.login({
      user: { username: newUser.username, password: newUser.password },
    });
    const token = (await loginRes.json()).token;

    return { userId, token, username: newUser.username };
  }
}
