import { APIResponse } from '@playwright/test';
import { BaseService } from './base.service';
import { User } from '../models/user.model';
import { endpoints } from '../config/endpoints';
import { ApiClient } from '../clients/api.client';

export class UserService extends BaseService<User> {
  constructor(client: ApiClient) {
    super(client, endpoints.users);
  }

  /**
   * Get users with pagination, search, and sort
   * @param params Query parameters (page, limit, keyword, sortBy, order)
   */
  async getUsers(params?: Record<string, string | number>): Promise<APIResponse> {
    // The ApiClient's get method supports passing params via options.params
    return this.client.get(this.endpoint, { params: params as any });
  }

  /**
   * Update a user by ID
   * @param id User ID
   * @param payload User data to update
   */
  async updateUser(id: number | string, payload: { user: Partial<User> }): Promise<APIResponse> {
    return this.client.put(endpoints.userById(id.toString()), payload);
  }
}
