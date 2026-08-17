import { query } from '../../core/config/db';

export interface UserRecord {
  id: number;
  username: string;
  avatar_url: string | null;
}

/**
 * Fetch user record directly from MySQL database by User ID
 */
export async function getUserAvatarFromDb(userId: number): Promise<string | null> {
  const rows = await query<UserRecord[]>(
    'SELECT avatar_url FROM users WHERE id = ?',
    [userId]
  );
  if (rows && Array.isArray(rows) && rows.length > 0) {
    return rows[0].avatar_url;
  }
  return null;
}

/**
 * Verify avatar_url in MySQL database matches expected path pattern
 */
export async function verifyAvatarInDb(userId: number, expectedSubstring: string): Promise<boolean> {
  const avatarUrl = await getUserAvatarFromDb(userId);
  if (!avatarUrl) {
    return false;
  }
  return avatarUrl.includes(expectedSubstring);
}

export async function dbVerify(userId: number, field: string, expectedValue: string): Promise<boolean> {
  const rows = await query<UserRecord[]>(
    `SELECT * FROM users WHERE id = ? AND ${field} = ?`,
    [userId, expectedValue]
  );
  if (rows && Array.isArray(rows) && rows.length > 0) {
    return true;
  }
  return false;
}
