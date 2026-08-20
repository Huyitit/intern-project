# E2E Auth Test Structure Analysis and Reusable Blueprint

This report analyzes the structure, patterns, and conventions of the E2E Auth test suite located at [tests/e2e/auth](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/e2e/auth). It provides a standardized blueprint and template that can be reused to write future E2E tests across the project.

## Architecture Overview

The E2E Auth test suite uses a clean, layered architecture separating test scenarios, page abstractions, data generation, fixtures, and authentication helpers.

```text
Playwright-Test/
├── tests/e2e/auth/                  # Test Spec Layer
│   ├── login.e2e.spec.ts
│   └── register.e2e.spec.ts
├── src/
│   ├── e2e/
│   │   ├── pages/                  # Page Object Model (POM) Layer
│   │   │   ├── base.page.ts
│   │   │   ├── login.page.ts
│   │   │   └── register.page.ts
│   │   ├── helpers/                # Helper & Teardown Layer
│   │   │   └── auth.helper.ts
│   │   └── fixtures.ts             # Custom Fixtures Extension Layer
│   └── data/
│       ├── builders/               # Dynamic Data Builders
│       │   └── user.builder.ts
│       └── e2e-dataset/auth/       # Test Case Datasets
│           ├── login.data.ts
│           └── register.data.ts
```

---

## Layer Breakdown

### 1. Test Spec Layer

Location: `tests/e2e/auth/*.e2e.spec.ts`

- Imports `test` and `expect` from custom fixtures (`src/e2e/fixtures`) instead of `@playwright/test`.
- Uses `test.describe()` to group feature test suites with tags (e.g., `{ tag: ['@e2e', '@auth'] }`).
- Defines individual test cases with scenario tags (e.g., `{ tag: ['@smoke', '@regression'] }`).
- Leverages Page Object Model fixtures (`loginPage`, `registerPage`) directly in test parameters.
- Uses data factory functions (e.g., `tcLOG01()`, `tcREG01()`) to supply predictable payloads.
- Keeps test bodies clean by delegating UI interactions to POM methods and asserting UI outcomes (toasts, URLs, visible elements).

### 2. Page Object Model Layer

Location: `src/e2e/pages/`

- Extends `BasePage` which handles navigation (`this.page.goto(path)`), base URL routing, and common layout locators.
- Declares element locators as `readonly` class properties initialized in the constructor via `getByTestId()` or `getByText()`.
- Exposes high-level action methods (`login()`, `register()`) to encapsulate form fills and submit clicks.
- Exposes reusable helper methods (e.g., `getToast(message)`) for flexible assertions.

### 3. Data Layer

Location: `src/data/e2e-dataset/auth/` and `src/data/builders/`

- Dataset functions (`tcLOG01()`, `tcREG01()`) return `TestCaseRecord` objects containing metadata (`tcId`, `description`), optional database seed specifications (`user`), and request/form payload data (`payload`).
- Uses `UserBuilder` for generating dynamic user credentials to avoid collisions.

### 4. Custom Fixtures Layer

Location: `src/e2e/fixtures.ts`

- Extends `@playwright/test` `base.extend<E2EFixtures>()`.
- Provides an option fixture `userRole` (`'admin' | 'user' | 'none'`).
- Auto-injects page instances (`loginPage`, `registerPage`, `dashboardPage`, `usersPage`) into tests.
- Provides `loginAs` dynamic helper for multi-role parallel browser context scenarios.

### 5. Helper and Teardown Layer

Location: `src/e2e/helpers/auth.helper.ts`

- `createAuthSession`: Handles API-based user registration, direct DB role updates, API login, and JWT/localStorage context injection.
- `destroyAuthSession`: Automatically cleans up browser contexts and deletes seeded user records from the database post-test.

---

## Conventions and Tagging Rules

- File Naming: `<feature_action>.e2e.spec.ts` inside `tests/e2e/<feature_folder>/`.
- Test ID Naming: Prefix with test case ID matching the dataset function (e.g., `TC_LOG_01: User Login - Successful`).
- Metadata Tags:
  - Suite Level: `{ tag: ['@e2e', '@<feature_name>'] }`
  - Case Level: `{ tag: ['@smoke', '@regression'] }` or `{ tag: '@regression' }`
- Locators: Prefer `page.getByTestId(...)` for resilient element selection.

---

## Reusable Blueprint for Future E2E Tests

Follow this 4-step workflow when building a new E2E test module (e.g., `profile` or `settings`).

### Step 1: Create Dataset File

Create `src/data/e2e-dataset/<feature>/<feature>.data.ts`:

```typescript
import { TestCaseRecord } from '../types';

export function tcFEAT01(): TestCaseRecord {
  return {
    tcId: 'TC_FEAT_01',
    description: 'Successful action scenario',
    payload: {
      field: 'sample-value',
    },
  };
}
```

### Step 2: Create Page Object Model

Create `src/e2e/pages/<feature>.page.ts`:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class FeaturePage extends BasePage {
  readonly inputField: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page, '/feature-url');
    this.inputField = page.getByTestId('feature-input');
    this.saveButton = page.getByTestId('feature-save-btn');
  }

  async performAction(value: string): Promise<void> {
    await this.inputField.fill(value);
    await this.saveButton.click();
  }
}
```

### Step 3: Register POM in Custom Fixture

In `src/e2e/fixtures.ts`, register the new page object:

```typescript
import { FeaturePage } from './pages/feature.page';

type E2EFixtures = {
  // ... existing fixtures
  featurePage: FeaturePage;
};

export const test = base.extend<E2EFixtures>({
  // ... existing fixtures
  featurePage: async ({ page }, use) => {
    await use(new FeaturePage(page));
  },
});
```

### Step 4: Write Feature E2E Test Spec

Create `tests/e2e/<feature>/<feature>.e2e.spec.ts`:

```typescript
import { test, expect } from '../../../src/e2e/fixtures';
import { tcFEAT01 } from '../../../src/data/e2e-dataset/<feature>/<feature>.data';

test.describe('E2E: Feature Test Suite', { tag: ['@e2e', '@feature'] }, () => {
  test('TC_FEAT_01: Perform feature action successfully', { tag: ['@smoke', '@regression'] }, async ({ featurePage, page }) => {
    const data = tcFEAT01();
    await featurePage.navigate();
    await featurePage.performAction(data.payload.field);

    await expect(page).toHaveURL(/\/expected-path/);
  });
});
```

---

## Summary Checklist for New E2E Tests

- Keep tests isolated by using dataset factories or dynamic builders.
- Use Playwright custom fixtures (`src/e2e/fixtures`) instead of raw imports.
- Interact with elements exclusively through POM classes extending `BasePage`.
- Assign descriptive test IDs (`TC_XXX_01`) matching dataset records.
- Apply consistent tags (`@e2e`, `@smoke`, `@regression`).
