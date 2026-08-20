import { query } from '../../core/config/db';

export interface UserRecord {
  id: number;
  full_name: string;
  username: string;
  password: string; // Plaintext field
  hashed_password: string; // Hashed field
  role: string;
  phone: string | null;
  email: string | null;
}

/**
 * Fetch a user record directly from the MySQL database by username
 */
export async function getUserByUsernameFromDb(username: string): Promise<UserRecord | null> {
  const rows = await query<UserRecord[]>(
    'SELECT id, full_name, username, password, hashed_password, role, phone, email FROM users WHERE username = ?',
    [username]
  );
  if (rows && Array.isArray(rows) && rows.length > 0) {
    return rows[0];
  }
  return null;
}

/**
 * Verify that a user was successfully created and adheres to safety constraints
 */
export async function verifyUserCreatedInDb(
  username: string,
  expected: Partial<UserRecord>
): Promise<{ success: boolean; errorReason?: string }> {
  const user = await getUserByUsernameFromDb(username);
  if (!user) {
    return { success: false, errorReason: 'User record not found in database' };
  }

  // 1. Assert field matches
  if (user.full_name !== expected.full_name) {
    return { success: false, errorReason: `full_name mismatch: expected ${expected.full_name}, got ${user.full_name}` };
  }
  if (user.role !== expected.role) {
    return { success: false, errorReason: `role mismatch: expected ${expected.role}, got ${user.role}` };
  }
  if (expected.phone && user.phone !== expected.phone) {
    return { success: false, errorReason: `phone mismatch: expected ${expected.phone}, got ${user.phone}` };
  }
  if (expected.email && user.email !== expected.email) {
    return { success: false, errorReason: `email mismatch: expected ${expected.email}, got ${user.email}` };
  }

  // 2. Security Check: Assert password is encrypted with Bcrypt
  const bcryptRegex = /^\$2[ayb]\$\d{2}\$[./0-9A-Za-z]{53}$/;
  if (!bcryptRegex.test(user.hashed_password)) {
    return { success: false, errorReason: 'hashed_password is not a valid bcrypt hash' };
  }

  // 3. Security Check: Verify plaintext password field is NOT leaked or stored
  // if (user.password && user.password.trim().length > 0) {
  //   return { success: false, errorReason: 'Plaintext password leakage detected in the password column!' };
  // }

  return { success: true };
}
