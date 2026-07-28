import { AuthService } from '../../services/auth.service';
import { Expectations } from '../assertions/base';
import { TestCaseRecord } from '../../../data/test_data/api.test.data';

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
