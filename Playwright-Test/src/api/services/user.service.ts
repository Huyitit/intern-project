import { APIResponse } from '@playwright/test';
import { BaseService } from './base.service';
import { User } from '../models/user.model';
import { endpoints } from '../config/endpoints';
import { ApiClient } from '../clients/api.client';

export class UserService extends BaseService<User> {
  constructor(client: ApiClient) {
    super(client, endpoints.users);
  }

  async getHealth(): Promise<APIResponse> {
    return this.client.get(endpoints.health);
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

  /**
   * Export users list (slow endpoint)
   */
  async exportUsers(): Promise<APIResponse> {
    return this.client.get(endpoints.exportUsers);
  }

  /**
   * Upload user avatar
   * @param id User ID
   * @param multipart Multipart file payload object
   */
  async uploadAvatar(id: number | string, multipart?: Record<string, any>): Promise<APIResponse> {
    return this.client.put(endpoints.userAvatar(id.toString()), undefined, { multipart });
  }

  /**
   * Update user via CSV upload
   * @param id User ID
   * @param multipart Multipart CSV file payload object
   */
  async uploadCsv(id: number | string, multipart?: Record<string, any>): Promise<APIResponse> {
    return this.client.post(endpoints.userCsv(id.toString()), undefined, { multipart });
  }
}
