# Test Design: Equivalence Partitioning, Boundary Value Analysis & Decision Table

## 1. Equivalence Partitioning (EP) & Boundary Value Analysis (BVA)

### Field 1: Password Length

**Constraints**: Minimum 6 characters, Maximum 20 characters (based on `registerUserSchema` / `userSchema`).

#### Equivalence Partitioning of Password Length

| Partition Type | Condition | Valid/Invalid | Test Value (Length) |
| :--- | :--- | :--- | :--- |
| **Valid** | 6 ≤ length ≤ 20 | Valid | `10 chars` |
| **Invalid 1** | length < 6 | Invalid | `4 chars` |
| **Invalid 2** | length > 20 | Invalid | `25 chars` |

#### Boundary Value Analysis (BVA)

**Partitions:**

| Partition Type | Boudary values | 2-value BVA coverage items | 3-value BVA coverage items |
| :--- | :--- | :--- | :--- |
| Q | 0 | 0 | 0, 1 |
| | 5 | 5, 6 | 4, 5, 6 |
| P | 6 | 6, 5 | 5, 6, 7 |
| | 20 | 20, 21 | 19, 20, 21 |
| R | 21 | 21, 20 | 20, 21, 22 |

**2-Value BVA:**
Tests the exact boundary value and the nearest adjacent value just outside the valid range.

| Test case | Test input | Expected result | Coverage |
| :--- | :--- | :--- | :--- |
| Q-min | `""` | Login rejected (too short) | 0 |
| Q-max | hello | Login rejected (too short) | 5 |
| P-min | cocain | Login accepted | 6 |
| P-max | 12345678900987654321 | Login accepted | 20 |
| R-min | 123456789009876543210 | Login rejected (too long) | 21 |

**3-Value BVA:**
Tests the boundary value, and the adjacent values both inside and outside the valid range.

| Test case | Test input | Expected output | Coverage |
| :--- | :--- | :--- | :--- |
| Q-min+1 | a | Login rejected (too short) | 1 |
| Q-max -1 | hell | Login rejected (too short) | 4 |
| P-min + 1 | cocaina | Login accepted | 7 |
| P-max -1 | 1234567890098765432 | Login accepted | 19 |
| R-min + 1 | 1234567890098765432100 | Login rejected (too long) | 22 |

---

### Field 2: Email

**Constraints**: String, Valid Email Format, Nullish.

#### Equivalence Partitioning of Email

*Note: BVA is generally not applied to string format validation unless explicit length constraints exist.*

| Partition Type | Condition | Valid/Invalid | Test Value |
| :--- | :--- | :--- | :--- |
| **Valid 1** | Standard valid email format | Valid | `test@example.com` |
| **Valid 2** | Null / Undefined (Nullish) | Valid | `null` |
| **Invalid 1** | Missing `@` symbol | Invalid | `testexample.com` |
| **Invalid 2** | Missing domain | Invalid | `test@.com` |
| **Invalid 3** | Missing username | Invalid | `@example.com` |
| **Invalid 4** | Contains spaces | Invalid | `test @example.com` |

---

## 2. Decision Table for Login

**Scenario**: User attempts to log in.
**Constraints (`loginUserSchema`)**:

- `username`: String, Min 6 chars, Lowercase
- `password`: String, Min 6 chars

| Conditions / Rules | R1 | R2 | R3 | R4 | R5 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **C1**: `username` is valid format | T | T | F | T | F |
| **C2**: `password` is valid format | T | T | T | F | F |
| **C3**: Credentials match database | T | F | - | - | - |
| **Actions** | | | | | |
| **A1**: Login Successful | X | | | | |
| **A2**: Validation Error (Username) | | | X | | X |
| **A3**: Validation Error (Password) | | | | X | X |
| **A4**: Invalid Credentials Error | | X | | | |

*Note: `-` signifies "Don't Care" since validation fails before reaching the database authentication check.*
