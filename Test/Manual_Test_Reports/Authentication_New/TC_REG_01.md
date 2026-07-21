# Test Report: TC_REG_01

## Test Case Details
- **Test Case ID:** TC_REG_01
- **Scenario:** B1. User Registration - Successful (All fields)
- **Preconditions:** None
- **Test Data:** 
  - Full Name: `Test User One`
  - Username: `testuser01`
  - Password: `password123`
  - Phone: `0123456789`
  - Email: `test1@example.com`
- **Expected Output:** Success message displayed. Navigated to login page.

## Execution Steps

### Step 1: Navigate to register page
The user successfully navigated to the register page.
![Step 1](./screenshots/TC_REG_01_step1.png)

### Step 2: Enter full name
The user entered the full name `Test User One`.
![Step 2](./screenshots/TC_REG_01_step2.png)

### Step 3: Enter username
The user entered the valid username `testuser01`.
![Step 3](./screenshots/TC_REG_01_step3.png)

### Step 4: Enter password
The user entered the valid password `password123`.
![Step 4](./screenshots/TC_REG_01_step4.png)

### Step 5: Enter phone number
The user entered the phone number `0123456789`.
![Step 5](./screenshots/TC_REG_01_step5.png)

### Step 6: Enter email
The user entered the email address `test1@example.com`.
![Step 6](./screenshots/TC_REG_01_step6.png)

### Step 7: Click register button
The user clicked the register button. The system displayed a success toast notification and navigated to the login page.
![Step 7](./screenshots/TC_REG_01_step7.png)

## Execution Result
- **Status:** PASS
- **Details:** The system successfully registered the new user with all fields provided, displayed a success message, and redirected to the login page. No bugs were detected.
