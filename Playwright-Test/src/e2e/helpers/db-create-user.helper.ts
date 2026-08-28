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
async function getUserByUsernameFromDb(username: string): Promise<UserRecord | null> {
  const rows = await query<UserRecord[]>(
    'SELECT id, full_name, username, password, hashed_password, role, phone, email FROM users WHERE username = ?',
    [username]
  );
  if (rows && Array.isArray(rows) && rows.length > 0) {
    return rows[0];
  }
  return null;
}

export const databaseValidate = {
  /**
   * Custom matcher for verifying that a user was successfully created and adheres to safety constraints
   */
  async toBeCreatedUser(receivedUsername: string, expected: Partial<UserRecord>) {
    const user = await getUserByUsernameFromDb(receivedUsername);
    if (!user) {
      return {
        pass: false,
        message: () => `User record for username '${receivedUsername}' not found in database`,
      };
    }

    // 1. Assert field matches
    if (user.full_name !== expected.full_name) {
      return {
        pass: false,
        message: () => `full_name mismatch: expected ${expected.full_name}, got ${user.full_name}`,
      };
    }
    if (user.role !== expected.role) {
      return {
        pass: false,
        message: () => `role mismatch: expected ${expected.role}, got ${user.role}`,
      };
    }
    if (expected.phone && user.phone !== expected.phone) {
      return {
        pass: false,
        message: () => `phone mismatch: expected ${expected.phone}, got ${user.phone}`,
      };
    }
    if (expected.email && user.email !== expected.email) {
      return {
        pass: false,
        message: () => `email mismatch: expected ${expected.email}, got ${user.email}`,
      };
    }

    // 2. Security Check: Assert password is encrypted with Bcrypt
    const bcryptRegex = /^\$2[ayb]\$\d{2}\$[./0-9A-Za-z]{53}$/;
    if (!bcryptRegex.test(user.hashed_password)) {
      return {
        pass: false,
        message: () => 'hashed_password is not a valid bcrypt hash',
      };
    }

    return {
      pass: true,
      message: () => 'User created and verified successfully in DB',
    };
  },
};
