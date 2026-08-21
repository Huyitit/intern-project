import { query } from '../../core/config/db';

export interface UserRecord {
  id: number;
  username: string;
  avatar_url: string | null;
}

/**
 * Fetch user record directly from MySQL database by User ID
 */

export const databaseValidate = {

  /**
   * Custom matcher for verifying that a user's avatar has been successfully uploaded to the database.
   * @param received - The ID of the user to verify.
   * @returns An object with `pass` (boolean) and `message` (string) properties.
   */
  async toBeUploadedAvatar(received: number) {
    let isFound = false;
    let message = "";

    const rows = await query<UserRecord[]>(
      'SELECT avatar_url FROM users WHERE id = ?',
      [received]
    );

    if (rows && Array.isArray(rows) && rows.length > 0) {
      if(rows[0].avatar_url){
        isFound = true;
      }
      else{
        message = "Avatar has not been updated";
      }
    }
    else{
      message = "Cannot find user in database";
    }

    return {
      pass: isFound,
      message: () => message
    }
  },

}
