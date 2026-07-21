# Test Report: TC_LOG_04

## Test Case Details
- **Test Case ID:** TC_LOG_04
- **Scenario:** A3. User Login - Incorrect Password
- **Preconditions:** System has seeded user data
- **Test Data:** 
  - Username: `username01`
  - Password: `wrongpass`
- **Expected Output:** Error message displayed. System remains on login page.

## Execution Steps

1. **Navigate to login page**
   - Action: Loaded `http://localhost:5173/login` in the browser.
   - Playwright Command: `await page.goto('http://localhost:5173/login');`
2. **Enter valid username**
   - Action: Filled the username input.
   - Interacted DOM Element: Input field with `data-testid="login-username-input"`.
   - Playwright Locator: `await page.getByTestId('login-username-input').fill('username01');`
3. **Enter incorrect password**
   - Action: Filled the password input.
   - Interacted DOM Element: Input field with `data-testid="login-password-input"`.
   - Playwright Locator: `await page.getByTestId('login-password-input').fill('wrongpass');`
4. **Click login button**
   - Action: Clicked the submit button.
   - Interacted DOM Element: Button with `type="submit"`.
   - Playwright Locator: `await page.evaluate('() => document.querySelector(\'button[type="submit"]\').click()');`

## Execution Result
- **Status:** PASS
- **Details:** The system successfully prevented the login and remained on the login page. An appropriate error notification was shown due to the incorrect password.

## Evidence (Final Result)
![Final Result Screenshot](./screenshots/TC_LOG_04_final.png)
