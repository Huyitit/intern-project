import { AuthService } from '../../services/auth.service';
import { Expectations } from '../assertions/base';
import { TestCaseRecord } from '../../../data/test_data/api.test.data';

/**
 * Registers a user from a test case record if the record contains a user.
 * Asserts that the registration returns 201 Created.
 */
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
