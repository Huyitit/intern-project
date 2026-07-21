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

### Step 1: Navigate to login page
The user successfully navigated to the login page.
![Step 1](./screenshots/TC_LOG_01_step1.png)

### Step 2: Enter username
The user entered the valid username `username01`.
![Step 2](./screenshots/TC_LOG_01_step2.png)

### Step 3: Enter password
The user entered the valid password `userpassword1`.
![Step 3](./screenshots/TC_LOG_01_step3.png)

### Step 4: Click login button
The user clicked the login button. The system displayed a success toast notification and navigated to the dashboard page.
![Step 4](./screenshots/TC_LOG_01_step4.png)

## Execution Result
- **Status:** PASS
- **Details:** The system successfully logged the user in, displayed a success message, and redirected to the dashboard. No bugs were detected.
