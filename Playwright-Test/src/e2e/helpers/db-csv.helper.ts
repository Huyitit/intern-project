import * as fs from 'fs';
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
async function getUsersForExportFromDb(): Promise<DbUserExportRecord[]> {
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
async function getUserByIdFromDb(userId: number): Promise<DbUserExportRecord | null> {
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

/**
 * Read and parse CSV file lines, filtering out empty rows
 */
function readCsvLines(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.trim().split('\n').filter((l) => l.trim().length > 0);
}

export const databaseValidate = {
  /**
   * Custom matcher for verifying that a CSV file's headers are correct
   */
  async toBeValidCSVHeaders(receivedFilePath: string, expectedHeaders: string[]) {
    const lines = readCsvLines(receivedFilePath);
    if (lines.length === 0) {
      return {
        pass: false,
        message: () => `CSV file at '${receivedFilePath}' is empty`,
      };
    }

    const headers = lines[0].split(',').map((h) => h.trim());
    for (const expectedHeader of expectedHeaders) {
      if (!headers.includes(expectedHeader)) {
        return {
          pass: false,
          message: () => `Expected header '${expectedHeader}' not found in CSV headers: [${headers.join(', ')}]`,
        };
      }
    }

    return {
      pass: true,
      message: () => 'CSV headers are valid',
    };
  },

  /**
   * Custom matcher for verifying that downloaded CSV data consistency matches API response length
   */
  async toBeConsistentWithApiUsers(receivedFilePath: string, expectedUsers: any[]) {
    const lines = readCsvLines(receivedFilePath);
    const csvDataRows = lines.slice(1);

    if (csvDataRows.length !== expectedUsers.length) {
      return {
        pass: false,
        message: () => `CSV data row count mismatch: API returned ${expectedUsers.length} users, but CSV has ${csvDataRows.length} data rows`,
      };
    }

    return {
      pass: true,
      message: () => 'CSV data row count matches the API response',
    };
  },

  /**
   * Custom matcher for verifying that downloaded CSV rows match database records
   */
  async toBeConsistentWithDbUsers(receivedFilePath: string) {
    const dbUsers = await getUsersForExportFromDb();
    const lines = readCsvLines(receivedFilePath);
    const csvDataRows = lines.slice(1);

    if (csvDataRows.length !== dbUsers.length) {
      return {
        pass: false,
        message: () => `CSV row count mismatch: database has ${dbUsers.length} users, but CSV has ${csvDataRows.length} data rows`,
      };
    }

    for (const dbUser of dbUsers) {
      const matchingRow = csvDataRows.find((row) => row.includes(dbUser.username));
      if (!matchingRow) {
        return {
          pass: false,
          message: () => `Expected database user '${dbUser.username}' was not found in any CSV row`,
        };
      }
    }

    return {
      pass: true,
      message: () => 'CSV rows are consistent with the database records',
    };
  },
};
