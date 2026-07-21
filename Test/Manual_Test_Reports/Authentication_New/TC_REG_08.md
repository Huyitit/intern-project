# Test Report: TC_REG_08

## Test Case Details
- **Test Case ID:** TC_REG_08
- **Scenario:** B7. User Registration - Long Username
- **Preconditions:** None
- **Test Data:** 
  - Full Name: `Test User Eight`
  - Username: `thisisaverylongusernamethatexceedsthethirtycharacterlimit`
  - Password: `password123`
  - Phone: (empty)
  - Email: (empty)
- **Expected Output:** Validation error displayed: "Username must be at most 30 characters long".

## Execution Steps

### Step 1: Navigate to register page
The user successfully navigated to the register page.
![Step 1](./screenshots/TC_REG_08_step1.png)

### Step 2: Enter full name
The user entered the valid full name `Test User Eight`.
![Step 2](./screenshots/TC_REG_08_step2.png)

### Step 3: Enter long username
The user entered a username exceeding 30 characters: `thisisaverylongusernamethatexceedsthethirtycharacterlimit`.
![Step 3](./screenshots/TC_REG_08_step3.png)

### Step 4: Enter password
The user entered the valid password `password123`.
![Step 4](./screenshots/TC_REG_08_step4.png)

### Step 5: Leave phone number empty
The user left the phone number field empty.
![Step 5](./screenshots/TC_REG_08_step5.png)

### Step 6: Leave email empty
The user left the email address field empty.
![Step 6](./screenshots/TC_REG_08_step6.png)

### Step 7: Click register button
The user clicked the register button. The system displayed a validation error toast notification and remained on the register page.
![Step 7](./screenshots/TC_REG_08_step7.png)

## Execution Result
- **Status:** PASS
- **Details:** The system successfully displayed a validation error toast indicating that the username must be at most 30 characters long. The registration attempt was prevented, and the user remained on the register page. No bugs were detected.
