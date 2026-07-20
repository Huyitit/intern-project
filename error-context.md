# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: register.spec.ts >> Feature: Register >> TC_REG_02: should register successfully with only required fields
- Location: tests/register.spec.ts:29:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Registration successful! Please login.')
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 45000ms
  - waiting for getByText('Registration successful! Please login.')

```

```yaml
- heading "Register" [level=2]
- text: "Full Name:"
- textbox: Req bwvmw3
- text: "Username:"
- textbox: req_bwvmw3
- text: "Password:"
- textbox: newpassword
- text: "Phone:"
- textbox
- text: "Email:"
- textbox
- button "Register"
- paragraph:
  - text: Already have an account?
  - link "Login here":
    - /url: /login
- region "Notifications Alt+T"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Feature: Register', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/register');
  6   |   });
  7   | 
  8   |   // Helper to generate short unique strings (6 chars) to fit the 20-character limit
  9   |   const getShortUnique = () => Math.random().toString(36).substring(2, 8);
  10  | 
  11  |   test('TC_REG_01: should register successfully with all fields', async ({ page }) => {
  12  |     test.setTimeout(60000); // Wait for cold start if needed
  13  |     const unique = getShortUnique();
  14  |     
  15  |     // Validations: Full Name (6-20), Username (6-20), Password (6-20), Phone (10-15)
  16  |     await page.getByTestId('register-full_name-input').fill(`User ${unique}`); // 11 chars
  17  |     await page.getByTestId('register-username-input').fill(`usr_${unique}`); // 10 chars
  18  |     await page.getByTestId('register-password-input').fill('newpassword'); // 11 chars
  19  |     await page.getByTestId('register-phone-input').fill('0123456789'); // 10 chars
  20  |     await page.getByTestId('register-email-input').fill(`u_${unique}@test.com`);
  21  |     
  22  |     await page.getByRole('button', { name: 'Register' }).click();
  23  | 
  24  |     // Expected Output: Success message displayed. Navigated back to login page.
  25  |     await expect(page.getByText('Registration successful! Please login.')).toBeVisible({ timeout: 45000 });
  26  |     await expect(page).toHaveURL(/\/login/);
  27  |   });
  28  | 
  29  |   test('TC_REG_02: should register successfully with only required fields', async ({ page }) => {
  30  |     const unique = getShortUnique();
  31  |     await page.getByTestId('register-full_name-input').fill(`Req ${unique}`);
  32  |     await page.getByTestId('register-username-input').fill(`req_${unique}`);
  33  |     await page.getByTestId('register-password-input').fill('newpassword');
  34  |     
  35  |     await page.getByRole('button', { name: 'Register' }).click();
  36  | 
  37  |     // Expected Output: Success message displayed. Navigated back to login page.
> 38  |     await expect(page.getByText('Registration successful! Please login.')).toBeVisible({ timeout: 45000 });
      |                                                                            ^ Error: expect(locator).toBeVisible() failed
  39  |     await expect(page).toHaveURL(/\/login/);
  40  |   });
  41  | 
  42  |   test('TC_REG_03: should not register with existing username', async ({ page }) => {
  43  |     await page.getByTestId('register-full_name-input').fill('Test User');
  44  |     await page.getByTestId('register-username-input').fill('username01');
  45  |     await page.getByTestId('register-password-input').fill('testpassword');
  46  |     
  47  |     await page.getByRole('button', { name: 'Register' }).click();
  48  | 
  49  |     const alert = page.locator('.Toastify__toast--error').first();
  50  |     await expect(alert).toBeVisible({ timeout: 15000 });
  51  |   });
  52  | 
  53  |   test('TC_REG_04: should block submission with empty required fields', async ({ page }) => {
  54  |     await page.getByRole('button', { name: 'Register' }).click();
  55  | 
  56  |     const fullNameInput = page.getByTestId('register-full_name-input');
  57  |     const isValid = await fullNameInput.evaluate((el: HTMLInputElement) => el.validity.valid);
  58  |     expect(isValid).toBeFalsy();
  59  |   });
  60  | 
  61  |   test('TC_REG_05: should not register with Full Name under 6 characters', async ({ page }) => {
  62  |     const unique = getShortUnique();
  63  |     await page.getByTestId('register-full_name-input').fill('Abcde'); // 5 chars
  64  |     await page.getByTestId('register-username-input').fill(`val_${unique}`);
  65  |     await page.getByTestId('register-password-input').fill('validpass');
  66  |     
  67  |     await page.getByRole('button', { name: 'Register' }).click();
  68  | 
  69  |     const alert = page.locator('.Toastify__toast--error').first();
  70  |     await expect(alert).toBeVisible({ timeout: 15000 });
  71  |     await expect(alert).toContainText(/full name must be at least 6 characters long/i);
  72  |   });
  73  | 
  74  |   test('TC_REG_06: should not register with Full Name over 20 characters', async ({ page }) => {
  75  |     const unique = getShortUnique();
  76  |     await page.getByTestId('register-full_name-input').fill('ThisIsAVeryLongFullName'); // 23 chars
  77  |     await page.getByTestId('register-username-input').fill(`val_${unique}`);
  78  |     await page.getByTestId('register-password-input').fill('validpass');
  79  |     
  80  |     await page.getByRole('button', { name: 'Register' }).click();
  81  | 
  82  |     const alert = page.locator('.Toastify__toast--error').first();
  83  |     await expect(alert).toBeVisible({ timeout: 15000 });
  84  |     await expect(alert).toContainText(/at most 20 characters long/i);
  85  |   });
  86  | 
  87  |   test('TC_REG_07: should not register with Username under 6 characters', async ({ page }) => {
  88  |     const unique = getShortUnique();
  89  |     await page.getByTestId('register-full_name-input').fill(`Name ${unique}`);
  90  |     await page.getByTestId('register-username-input').fill('user1'); // 5 chars
  91  |     await page.getByTestId('register-password-input').fill('validpass');
  92  |     
  93  |     await page.getByRole('button', { name: 'Register' }).click();
  94  | 
  95  |     const alert = page.locator('.Toastify__toast--error').first();
  96  |     await expect(alert).toBeVisible({ timeout: 15000 });
  97  |     await expect(alert).toContainText(/username must be at least 6 characters long/i);
  98  |   });
  99  | 
  100 |   test('TC_REG_08: should not register with Username over 20 characters', async ({ page }) => {
  101 |     const unique = getShortUnique();
  102 |     await page.getByTestId('register-full_name-input').fill(`Name ${unique}`);
  103 |     await page.getByTestId('register-username-input').fill('ThisIsAVeryLongUsername'); // 23 chars
  104 |     await page.getByTestId('register-password-input').fill('validpass');
  105 |     
  106 |     await page.getByRole('button', { name: 'Register' }).click();
  107 | 
  108 |     const alert = page.locator('.Toastify__toast--error').first();
  109 |     await expect(alert).toBeVisible({ timeout: 15000 });
  110 |     await expect(alert).toContainText(/at most 20 characters long/i);
  111 |   });
  112 | 
  113 |   test('TC_REG_09: should not register with Password under 6 characters', async ({ page }) => {
  114 |     const unique = getShortUnique();
  115 |     await page.getByTestId('register-full_name-input').fill(`Name ${unique}`);
  116 |     await page.getByTestId('register-username-input').fill(`val_${unique}`);
  117 |     await page.getByTestId('register-password-input').fill('pass1'); // 5 chars
  118 |     
  119 |     await page.getByRole('button', { name: 'Register' }).click();
  120 | 
  121 |     const alert = page.locator('.Toastify__toast--error').first();
  122 |     await expect(alert).toBeVisible({ timeout: 15000 });
  123 |     await expect(alert).toContainText(/password must be at least 6 characters long/i);
  124 |   });
  125 | 
  126 |   test('TC_REG_10: should not register with Phone under 10 digits', async ({ page }) => {
  127 |     const unique = getShortUnique();
  128 |     await page.getByTestId('register-full_name-input').fill(`Name ${unique}`);
  129 |     await page.getByTestId('register-username-input').fill(`val_${unique}`);
  130 |     await page.getByTestId('register-password-input').fill('validpass');
  131 |     await page.getByTestId('register-phone-input').fill('12345'); // 5 chars
  132 |     
  133 |     await page.getByRole('button', { name: 'Register' }).click();
  134 | 
  135 |     const alert = page.locator('.Toastify__toast--error').first();
  136 |     await expect(alert).toBeVisible({ timeout: 15000 });
  137 |     await expect(alert).toContainText(/phone must be at least 10 digits long/i);
  138 |   });
```