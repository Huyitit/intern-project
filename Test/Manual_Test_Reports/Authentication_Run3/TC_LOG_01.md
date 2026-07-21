# Test Report: TC_LOG_01

## Test Case Details
- **Test Case ID:** TC_LOG_01
- **Scenario:** A1. User Login - Successful
- **Preconditions:** System has seeded user data
- **Test Data:** 
  - Username: `username01`
  - Password: `userpassword1`
- **Expected Output:** Success message displayed. Navigated to dashboard.

## Execution Steps

1. **Navigate to login page**
   - Action: Loaded `http://localhost:5173/login` in the browser.
   - Playwright Command: `await page.goto('http://localhost:5173/login');`
2. **Enter username**
   - Action: Filled the username input.
   - Interacted DOM Element: Input field with `data-testid="login-username-input"`.
   - Playwright Locator: `await page.getByTestId('login-username-input').fill('username01');`
3. **Enter password**
   - Action: Filled the password input.
   - Interacted DOM Element: Input field with `data-testid="login-password-input"`.
   - Playwright Locator: `await page.getByTestId('login-password-input').fill('userpassword1');`
4. **Click login button**
   - Action: Clicked the submit button.
   - Interacted DOM Element: Button with `type="submit"`.
   - Playwright Locator: `await page.evaluate('() => document.querySelector(\'button[type="submit"]\').click()');`

## Execution Result
- **Status:** PASS
- **Details:** The system successfully authenticated the user and navigated to the `/dashboard` route. The dashboard view was successfully loaded.

## Evidence (Final Result)
![Final Result Screenshot](./screenshots/TC_LOG_01_final.png)
