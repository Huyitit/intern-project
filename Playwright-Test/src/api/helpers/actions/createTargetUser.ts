import { AuthService } from '../../services/auth.service';
import { UserBuilder } from '../../../data/builders/user.builder';

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

export default createTargetUser;
