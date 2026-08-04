import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseService } from './base.service';
import { User } from '../models/user.model';
import { endpoints } from '../config/endpoints';

export class UserService extends BaseService<User> {
  constructor(request: APIRequestContext, token?: string) {
    super(request, endpoints.users, token);
  }

  async getHealth(): Promise<APIResponse> {
    return this.get(endpoints.health);
  }

  /**
   * Get users with pagination, search, and sort
   * @param params Query parameters (page, limit, keyword, sortBy, order)
   */
  async getUsers(params?: Record<string, string | number>): Promise<APIResponse> {
    // The base service's get method supports passing params via options.params
    return this.get(this.endpoint, { params: params as any });
  }

  /**
   * Update a user by ID
   * @param id User ID
   * @param payload User data to update
   */
  async updateUser(id: number | string, payload: { user: Partial<User> }): Promise<APIResponse> {
    return this.put(endpoints.userById(id.toString()), payload);
  }

  /**
   * Export users list (slow endpoint)
   */
  async exportUsers(): Promise<APIResponse> {
    return this.get(endpoints.exportUsers);
  }

  /**
   * Upload user avatar
   * @param id User ID
   * @param multipart Multipart file payload object
   */
  async uploadAvatar(id: number | string, multipart?: Record<string, any>): Promise<APIResponse> {
    return this.put(endpoints.userAvatar(id.toString()), undefined, { multipart });
  }

  /**
   * Update user via CSV upload
   * @param id User ID
   * @param multipart Multipart CSV file payload object
   */
  async uploadCsv(id: number | string, multipart?: Record<string, any>): Promise<APIResponse> {
    return this.post(endpoints.userCsv(id.toString()), undefined, { multipart });
  }
}
