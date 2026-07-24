import { APIResponse, expect } from "@playwright/test";
import { ZodTypeAny } from "zod";
import jwt from 'jsonwebtoken';
import zod from 'zod';
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
export class Expectations{
  
  /**
   * Test Resposne schema
   * @param response 
   * @param schema 
   */
  async expectSchema(response: APIResponse, schema: ZodTypeAny){
    const json = await response.json();
    const result = schema.safeParse(json);

    const errorMessage = result.success
      ? ""
      : `Response body does not match schema:\n
          ${JSON.stringify(zod.toJSONSchema(schema), null, 4)}
          \n${result.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("\n")}\nRaw Body: ${JSON.stringify(json, null, 4)}`;
    
    expect(result.success, errorMessage).toBe(true);
  }

  /**
   * Test Response token
   * @param response 
   * @param expectedTime 
   */
  async expectToken(response: APIResponse, schema: any, isJWT?:boolean, isExpired?:boolean){
    const json = await response.json();
    const token: string = json.token;

    expect(token, 'Token should be defined in the response').toBeDefined();
    expect(typeof token, 'Token should be a string').toBe('string');
    expect(token.length, 'Token should not be empty').toBeGreaterThan(0);

    if (isJWT) {
      const parts = token.split('.');
      expect(parts.length, 'Token should be a valid JWT with 3 parts').toBe(3);
    }
  }

  /**
   * Test Status code
   * @param response 
   * @param status 
   */
  async expectStatus(response: APIResponse, status: number){
    if (response.status() !== status) {
      try {
        const json = await response.json();
        console.error(`Status mismatch! Expected ${status}, got ${response.status()}. Body:`, json);
      } catch (e) {
        console.error(`Status mismatch! Expected ${status}, got ${response.status()}. Body could not be parsed as JSON.`);
      }
    }
    expect(response.status()).toBe(status);
  }

  // expectHeaders(response:APIResponse, headers: Record<string, string>){
  //   for(const [key, value] of Object.entries(headers)){
  //     expect(response.headers()).toContain({[key]: value});
  //   }
  // }

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

    expect(array, `Array at path '${arrayPath}' should exist`).toBeDefined();
    expect(Array.isArray(array), `Path '${arrayPath}' should be an array`).toBe(true);
    expect(array.length, `Array at path '${arrayPath}' should have at least ${minLength} items`).toBeGreaterThanOrEqual(minLength);

    for (const item of array) {
      expect(item[propertyName], `Item in array '${arrayPath}' should have property '${propertyName}' with value '${expectedValue}'`).toBe(expectedValue);
    }
  }
}