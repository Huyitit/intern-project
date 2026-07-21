# Test Report: TC_REG_07

## Test Case Details
- **Test Case ID:** TC_REG_07
- **Scenario:** B6. User Registration - Short Username
- **Preconditions:** None
- **Test Data:** 
  - Full Name: `Test User Seven`
  - Username: `usr`
  - Password: `password123`
  - Phone: (empty)
  - Email: (empty)
- **Expected Output:** Validation error displayed: "Username must be at least 6 characters long".

## Execution Steps

### Step 1: Navigate to register page
The user successfully navigated to the register page.
![Step 1](./screenshots/TC_REG_07_step1.png)

### Step 2: Enter full name
The user entered the full name `Test User Seven`.
![Step 2](./screenshots/TC_REG_07_step2.png)

### Step 3: Enter short username
The user entered a short username `usr`.
![Step 3](./screenshots/TC_REG_07_step3.png)

### Step 4: Enter password
The user entered the valid password `password123`.
![Step 4](./screenshots/TC_REG_07_step4.png)

### Step 5: Leave phone number empty
The user left the phone number field empty.
![Step 5](./screenshots/TC_REG_07_step5.png)

### Step 6: Leave email empty
The user left the email address field empty.
![Step 6](./screenshots/TC_REG_07_step6.png)

### Step 7: Click register button
The user clicked the register button. The system displayed a validation error toast notification and remained on the register page.
![Step 7](./screenshots/TC_REG_07_step7.png)

## Execution Result
- **Status:** PASS
- **Details:** The system successfully displayed a validation error toast indicating that the username must be at least 6 characters long. The registration attempt was prevented, and the user remained on the register page. No bugs were detected.
