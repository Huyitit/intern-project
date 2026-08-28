import { pool } from '../../core/config/db';

export async function cleanupTestData(): Promise<void> {
  try {
    const [result] = await pool.execute("DELETE FROM users WHERE username LIKE 'test%'" );
    const affectedRows = (result as any).affectedRows ?? 0;
    console.log(`[Cleanup] Deleted ${affectedRows} test user(s) with 'test' prefix.`);
  } catch (error) {
    console.error('[Cleanup] Error deleting test user data:', error);
  }
}

export default cleanupTestData;
