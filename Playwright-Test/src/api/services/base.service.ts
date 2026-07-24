import { APIResponse } from '@playwright/test';
import { ApiClient } from '../clients/api.client';

export abstract class BaseService<T> {
  constructor(protected client: ApiClient, protected endpoint: string) {}

  async create(payload: Partial<T>): Promise<APIResponse> {
    const res = await this.client.post(this.endpoint, payload);
    return res;
  }

  async getById(id: string): Promise<APIResponse> {
    const res = await this.client.get(`${this.endpoint}/${id}`);
    return res;
  }
  async delete(id: string): Promise<APIResponse> {
    const res = await this.client.delete(`${this.endpoint}/${id}`);
    return res;
  }
}