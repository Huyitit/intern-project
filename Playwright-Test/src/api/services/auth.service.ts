import { BaseService } from "./base.service";
import { User, LoginRequest, RegisterRequest } from "../models/user.model";
import { RequestOptions } from "../clients/options.client";
import { AuthClient } from "../clients/auth.client";
import { endpoints } from "../config/endpoints";
import { APIResponse } from "@playwright/test";


export class AuthService {
  constructor (protected client: AuthClient) {}

  async login(credentials: LoginRequest): Promise<APIResponse>{
    const res = await this.client.post(endpoints.login, credentials);
    return res;
  }

  async register(payload: any, options: RequestOptions = {}): Promise<APIResponse>{
    const res = await this.client.post(endpoints.register, payload, options);
    return res;
  }

}

