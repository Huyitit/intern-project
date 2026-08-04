import { APIRequestContext, APIResponse } from '@playwright/test';

export abstract class BaseService<T> {
  constructor(protected request: APIRequestContext, protected endpoint: string, protected token?: string) {}

  private mergeHeaders(options: any = {}) {
    const headers = options.headers || {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return { ...options, headers };
  }

  async get(url: string, options: any = {}): Promise<APIResponse> {
    return this.request.get(url, this.mergeHeaders(options));
  }

  async post(url: string, payload?: any, options: any = {}): Promise<APIResponse> {
    return this.request.post(url, { data: payload, ...this.mergeHeaders(options) });
  }

  async put(url: string, payload?: any, options: any = {}): Promise<APIResponse> {
    return this.request.put(url, { data: payload, ...this.mergeHeaders(options) });
  }

  // async deleteUrl(url: string, options: any = {}): Promise<APIResponse> {
  //   return this.request.delete(url, this.mergeHeaders(options));
  // }

  async create(payload: Partial<T>, options: any = {}): Promise<APIResponse> {
    return this.post(this.endpoint, payload, options);
  }

  async getById(id: string, options: any = {}): Promise<APIResponse> {
    return this.get(`${this.endpoint}/${id}`, options);
  }

  async delete(id: string, options: any = {}): Promise<APIResponse> {
    return this.request.delete(`${this.endpoint}/${id}`, this.mergeHeaders(options));
  }
}