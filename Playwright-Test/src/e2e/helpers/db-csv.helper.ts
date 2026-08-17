import { query } from '../../core/config/db';

export interface DbUserExportRecord {
  id: number;
  full_name: string;
  username: string;
  phone: string | null;
  email: string;
  role: string;
  create_at: Date | string;
}

/**
 * Fetch all users with role='user' directly from MySQL database for export comparison
 */
export async function getUsersForExportFromDb(): Promise<DbUserExportRecord[]> {
  const rows = await query<DbUserExportRecord[]>(
    `SELECT id, full_name, username, phone, email, role, create_at 
     FROM users 
     WHERE role = 'user' 
     ORDER BY id ASC`
  );
  if (rows && Array.isArray(rows)) {
    return rows;
  }
  return [];
}

/**
 * Fetch a single user by User ID directly from MySQL database
 */
export async function getUserByIdFromDb(userId: number): Promise<DbUserExportRecord | null> {
  const rows = await query<DbUserExportRecord[]>(
    `SELECT id, full_name, username, phone, email, role, create_at 
     FROM users 
     WHERE id = ?`,
    [userId]
  );
  if (rows && Array.isArray(rows) && rows.length > 0) {
    return rows[0];
  }
  return null;
}
