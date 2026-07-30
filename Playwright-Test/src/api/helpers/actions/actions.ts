import { AuthService } from "../../services/auth.service";
import { UserBuilder } from "../../../data/builders/user.builder";
import { TestCaseRecord } from "../../../data/test_data/api.test.data";
import { Expectations } from "../assertions/base";
import { UserService } from "../../services/user.service";
import { ApiClient } from "../../clients/api.client";
import {APIRequestContext} from '@playwright/test'

export interface TargetUserInfo {
  userId: number;
  token: string;
  username: string;
}

/**
 * Registers a new valid user and logs them in, returning their userId, session token, and username.
 * Reusable helper action for CRUD tests requiring an authenticated target user.
 */
export async function createTargetUser(authService: AuthService): Promise<TargetUserInfo> {
  const newUser = new UserBuilder().setValidNewUser().build();
  const registerRes = await authService.register({ user: newUser });
  const userId = (await registerRes.json()).user.id;

  const loginRes = await authService.login({
    user: { username: newUser.username, password: newUser.password },
  });
  const token = (await loginRes.json()).token;

  return { userId, token, username: newUser.username };
}

export async function loginUser(
  record: TestCaseRecord,
  authService: AuthService,
  expectations: Expectations
): Promise<string> {
  if (record.user) {
    const registerRes = await authService.login({ user: record.user });
    await expectations.expectStatus(registerRes, 200);
    return (await registerRes.json()).token;
  }
  return '';
}


export async function registerUser(
  record: TestCaseRecord,
  authService: AuthService,
  expectations: Expectations
): Promise<void> {
  if (record.user) {
    const registerRes = await authService.register({ user: record.user });
    await expectations.expectStatus(registerRes, 201);
  }
}

export async function registerUserAndGetInfo(
  record: TestCaseRecord,
  authService: AuthService,
  expectations: Expectations
): Promise<{ id: number, username: string }> {
  if (record.user) {
    const registerRes = await authService.register({ user: record.user });
    await expectations.expectStatus(registerRes, 201);
    const body = await registerRes.json();
    return { id: body.user.id, username: body.user.username };
  }
  return { id: 0, username: '' };
}

export async function createOwnerService(request: APIRequestContext, token: string): Promise<UserService> {
  return new UserService(new ApiClient(request, token));
}

export default [
  createTargetUser,
  registerUser,
  loginUser,
  registerUserAndGetInfo
]