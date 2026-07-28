import { AuthService } from '../../services/auth.service';
import { Expectations } from '../assertions/base';
import { TestCaseRecord } from '../../../data/test_data/api.test.data';

/**
 * Registers a user from a test case record if the record contains a user.
 * Asserts that the registration returns 201 Created.
 * Then return the id of created User
 */
export async function registerUserAndGetId(
  record: TestCaseRecord,
  authService: AuthService,
  expectations: Expectations
): Promise<number> {
  if (record.user) {
    const registerRes = await authService.register({ user: record.user });
    await expectations.expectStatus(registerRes, 201);
    return (await registerRes.json()).user.id;
  }
  return 0;
}
