# Test Report: TC_LOG_03

## Test Case Details
- **Test Case ID:** TC_LOG_03
- **Scenario:** A2. User Login - Unregistered Username
- **Preconditions:** None
- **Test Data:** 
  - Username: `nonexistent`
  - Password: `password123`
- **Expected Output:** Error message displayed. System remains on login page.

## Execution Steps

1. **Navigate to login page**
   - Action: Loaded `http://localhost:5173/login` in the browser.
   - Playwright Command: `await page.goto('http://localhost:5173/login');`
2. **Enter unregistered username**
   - Action: Filled the username input.
   - Interacted DOM Element: Input field with `data-testid="login-username-input"`.
   - Playwright Locator: `await page.getByTestId('login-username-input').fill('nonexistent');`
3. **Enter password**
   - Action: Filled the password input.
   - Interacted DOM Element: Input field with `data-testid="login-password-input"`.
   - Playwright Locator: `await page.getByTestId('login-password-input').fill('password123');`
4. **Click login button**
   - Action: Clicked the submit button.
   - Interacted DOM Element: Button with `type="submit"`.
   - Playwright Locator: `await page.evaluate('() => document.querySelector(\'button[type="submit"]\').click()');`

## Execution Result
- **Status:** PASS
- **Details:** The system successfully prevented the login and remained on the login page. An appropriate error notification was shown.

## Evidence (Final Result)
![Final Result Screenshot](./screenshots/TC_LOG_03_final.png)
