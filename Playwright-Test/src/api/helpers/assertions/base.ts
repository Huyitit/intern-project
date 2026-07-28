import { APIResponse, expect } from "@playwright/test";
import { ZodTypeAny } from "zod";
import { pool } from "../../config/db";
import zod from 'zod';
import { RowDataPacket } from "mysql2";

/**
 * 1️⃣ Status Code Assertion
 * 2️⃣ Response Time Assertion
 * 3️⃣ Response Header Assertion
 * 4️⃣ Response Body Field Assertion
 * 5️⃣ Property Existence Assertion
 * 6️⃣ Data Type Assertion
 * 7️⃣ Array Validation Assertion
 * 8️⃣ String Pattern (Regex) Assertion
 * 9️⃣ Error Message Assertion
 * 🔟 Nested Object Assertion
 * 1️⃣1️⃣ Chaining & Dynamic Data Assertion
 * 1️⃣2️⃣ Schema Validation Assertion
 */

export class Expectations {
  
  /**
   * Test Response schema
   * @param response 
   * @param schema 
   */
  async expectSchema(response: APIResponse, schema: ZodTypeAny) {
    const json = await response.json();
    const result = schema.safeParse(json);

    const errorMessage = result.success
      ? ""
      : `Response body does not match expected schema:\n
          ${JSON.stringify(zod.toJSONSchema(schema), null, 4)}
          \n${result.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("\n")}\nRaw Body: ${JSON.stringify(json, null, 4)}`;
    
    expect(result.success, errorMessage).toBe(true);
  }

  /**
   * Test Response token format
   * @param response 
   * @param schema 
   * @param isJWT 
   * @param isExpired 
   */
  async expectToken(response: APIResponse, schema: any, isJWT?: boolean, isExpired?: boolean) {
    const json = await response.json();
    const token: string = json.token;

    expect(token, 'Token property should be defined in the response body').toBeDefined();
    expect(typeof token, 'Token should be a string').toBe('string');
    expect(token.length, 'Token string length should be greater than 0').toBeGreaterThan(0);

    if (isJWT) {
      const parts = token.split('.');
      expect(parts.length, 'JWT token should consist of 3 dot-separated parts (header.payload.signature)').toBe(3);
    }
  }

  /**
   * Test Status code
   * @param response 
   * @param status 
   */
  async expectStatus(response: APIResponse, status: number) {
    if (response.status() !== status) {
      try {
        const json = await response.json();
        console.error(`Status mismatch! Expected HTTP ${status}, but received HTTP ${response.status()}. Body:`, json);
      } catch (e) {
        console.error(`Status mismatch! Expected HTTP ${status}, but received HTTP ${response.status()}. Body could not be parsed as JSON.`);
      }
    }
    expect(response.status(), `Expected response status code to be ${status}, but received ${response.status()}`).toBe(status);
  }

  /**
   * Test array property existence and items value
   * @param response 
   * @param arrayPath Path to array in body (e.g., 'users' or 'data.users')
   * @param propertyName Property inside array item (e.g., 'role')
   * @param expectedValue Expected value for the property
   * @param minLength Minimum expected length of the array
   */
  async expectArrayItemProperty(response: APIResponse, arrayPath: string, propertyName: string, expectedValue: any, minLength: number = 1) {
    const json = await response.json();
    
    // Extract array from path (supports 'users' or 'data.users')
    const array = arrayPath.split('.').reduce((obj, key) => obj?.[key], json);

    expect(array, `Array at path '${arrayPath}' should be defined in the response`).toBeDefined();
    expect(Array.isArray(array), `Target property at path '${arrayPath}' should be an Array`).toBe(true);
    expect(array.length, `Array at path '${arrayPath}' length (${array.length}) should be greater than or equal to ${minLength}`).toBeGreaterThanOrEqual(minLength);

    for (const item of array) {
      expect(item[propertyName], `Item in array '${arrayPath}' should have property '${propertyName}' with value '${expectedValue}'`).toBe(expectedValue);
    }
  }

  /**
   * Test that a user record was inserted into the local MySQL database matching payload details
   * @param payload User creation payload
   */
  async expectUserCreatedOnDatabase(payload: any) {
    const sql = "SELECT * FROM users WHERE username = ?";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [payload.user.username]);

    expect(rows, `User with username '${payload.user.username}' should exist in local MySQL database`).toHaveLength(1);

    const user = rows[0];
    
    expect(user, `Database user record for '${payload.user.username}' should match creation payload fields`).toEqual(
      expect.objectContaining({
        username: payload.user.username,
        full_name: payload.user.full_name,
      })
    );
  }
}