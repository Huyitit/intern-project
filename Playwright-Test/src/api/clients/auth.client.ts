import { APIRequestContext, APIResponse } from "@playwright/test";
import { RequestOptions } from './options.client'
import { LoginRequest, RegisterRequest } from "../models/user.model";

export class AuthClient {
  constructor(private request: APIRequestContext) {}

  async post(url: string, data: any, options: RequestOptions = {}): Promise<APIResponse> {
    const res = await this.request.post(url, { 
      data: data,
      headers: options.headers
     });
    return res;
  }
}
