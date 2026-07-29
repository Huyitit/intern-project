import { APIRequestContext, APIResponse } from '@playwright/test';
import { RequestOptions } from './options.client';
import { Logger } from '../utils/logger';

/**
 * ApiClient class for making API requests
 * @param request - API request context
 * @Return APIResponse
 */
export class ApiClient {
  constructor(private request: APIRequestContext, private token: string) { }

  // set token for client session
  private authHeaders() {
    if (this.token)
      return { Authorization: `Bearer ${this.token}` };
  }

  // add custom header to request
  private mergeHeader(custom?: Record<string, string>) {
    return { ...this.authHeaders(), ...custom };
  }

  async get(url: string, options: RequestOptions = {}): Promise<APIResponse> {
    const startTime = Date.now();
    const res = await this.request.get(url, {
      headers: this.mergeHeader(options.headers),
      params: options.params,
    });
    const duration = Date.now() - startTime;
    Logger.logApiCall('GET', url, res.status(), duration, options.params);
    return res;
  }

  async post(url: string, data?: object, options: RequestOptions = {}): Promise<APIResponse> {
    const startTime = Date.now();
    const res = await this.request.post(url, {
      data,
      headers: this.mergeHeader(options.headers),
      params: options.params,
      multipart: options.multipart
    });
    const duration = Date.now() - startTime;
    Logger.logApiCall('POST', url, res.status(), duration, data || options.multipart);
    return res;
  }

  async put(url: string, data?: object, options: RequestOptions = {}): Promise<APIResponse> {
    const startTime = Date.now();
    const res = await this.request.put(url, {
      data,
      headers: this.mergeHeader(options.headers),
      multipart: options.multipart
    });
    const duration = Date.now() - startTime;
    Logger.logApiCall('PUT', url, res.status(), duration, data || options.multipart);
    return res;
  }

  async delete(url: string, options: RequestOptions = {}): Promise<APIResponse> {
    const startTime = Date.now();
    const res = await this.request.delete(url, {
      headers: this.mergeHeader(options.headers)
    });
    const duration = Date.now() - startTime;
    Logger.logApiCall('DELETE', url, res.status(), duration);
    return res;
  }
}