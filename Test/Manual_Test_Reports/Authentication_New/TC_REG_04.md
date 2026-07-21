# Test Report: TC_REG_04

## Test Case Details
- **Test Case ID:** TC_REG_04
- **Scenario:** B4. User Registration - Empty Required Fields
- **Preconditions:** None
- **Test Data:** 
  - Full Name: (empty)
  - Username: (empty)
  - Password: (empty)
  - Phone: (empty)
  - Email: (empty)
- **Expected Output:** Validation errors displayed for all required fields.

## Execution Steps

### Step 1: Navigate to register page
The user successfully navigated to the register page.
![Step 1](./screenshots/TC_REG_04_step1.png)

### Step 2: Leave all fields empty
The user left all fields empty.
![Step 2](./screenshots/TC_REG_04_step2.png)

### Step 3: Click register button
The user clicked the register button. The system displayed validation error toast notifications and remained on the register page.
![Step 3](./screenshots/TC_REG_04_step3.png)

## Execution Result
- **Status:** PASS
- **Details:** The system successfully displayed validation errors for the empty required fields. The registration attempt was prevented, and the user remained on the register page. No bugs were detected.
