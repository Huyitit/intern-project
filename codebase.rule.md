# Enterprise Playwright API Automation Coding Standards

## Objective

Generate production-quality, maintainable, deterministic Playwright API automation code suitable for large enterprise projects.

---

# 1. General Principles

* Write code for maintainability, not just correctness.
* Prefer readability over clever implementations.
* Every test should clearly express business behavior.
* Follow the Single Responsibility Principle.
* Avoid duplicated logic (DRY).
* Keep tests deterministic and repeatable.

---

# 2. Test Design

Each test should:

* Verify one business scenario.
* Be independent from every other test.
* Create its own test data whenever possible.
* Never rely on execution order.
* Never depend on previous tests.
* Clean up created resources when appropriate.

---

# 3. API Client Layer

Separate business logic from tests.

Example architecture:

```text
tests/
api/
models/
builders/
fixtures/
utils/
config/
```

Tests should never:

* build URLs
* construct headers
* manage authentication
* parse response JSON repeatedly

Instead, encapsulate those responsibilities in API client classes/functions.

Example:

```ts
await userApi.createUser(user);
await orderApi.getOrder(orderId);
await paymentApi.capture(paymentId);
```

---

# 4. Waiting Strategy

## Never use hardcoded waits.

Forbidden:

```ts
waitForTimeout(...)
Thread.sleep(...)
setTimeout(...)
```

Instead:

* wait for business state
* use expect.poll()
* use Playwright auto waiting
* configure reasonable timeout values

Correct:

```ts
await expect.poll(async () => {
    return (await orderApi.getOrder(id)).status;
}).toBe("COMPLETED");
```

Always wait for business conditions, never elapsed time.

---

# 5. expect.poll() Usage

Use expect.poll() only when the system is eventually consistent.

Examples:

* order processing
* report generation
* payment completion
* search indexing
* database propagation
* async workflows

Do NOT use expect.poll() for:

* synchronous APIs
* static response validation
* values that never change

Poll one business condition, then perform normal assertions.

Preferred pattern:

```ts
await expect.poll(async () => {
    return (await orderApi.getOrder(id)).status;
}).toBe("COMPLETED");

const order = await orderApi.getOrder(id);

expect(order.total).toBe(120);
expect(order.invoiceId).toBeDefined();
expect(order.items.length).toBe(3);
```

---

# 6. Retry Strategy

Retries should only handle transient infrastructure failures.

Examples:

* temporary network issues
* 503
* gateway timeout
* connection reset

Retries must NOT replace proper synchronization.

Do NOT retry because the system is still processing.

Business waiting belongs to expect.poll().

Avoid nested retry loops.

Preferred responsibility:

```
HTTP Client
    ↓
retry transport failures

API Client
    ↓
perform request

Test
    ↓
expect.poll() for business completion
```

---

# 7. Assertions

Assertions should validate business behavior.

Avoid only checking HTTP status.

Weak:

```ts
expect(response.status()).toBe(200);
```

Preferred:

```ts
expect(response.status()).toBe(201);
expect(body.id).toBeDefined();
expect(body.name).toBe(user.name);
expect(body.status).toBe("ACTIVE");
```

---

# 8. Readability

Use descriptive names.

Good:

```ts
createUser()

deleteOrder()

paymentApi.capture()
```

Avoid abbreviations.

Bad:

```ts
t1()

abc()

x()
```

Variable names should explain intent.

---

# 9. Reusability

Move repeated logic into:

* API clients
* utilities
* fixtures
* builders
* helper functions

Never duplicate request construction.

---

# 10. Test Data

Avoid hardcoded values.

Bad:

```ts
email = "john@test.com"
```

Preferred:

```ts
email = randomEmail()
```

Use builders or factories whenever possible.

---

# 11. Configuration

Never hardcode:

* URLs
* credentials
* timeout values
* environment names

Use configuration files or environment variables.

Example:

```
BASE_URL
API_TIMEOUT
AUTH_TOKEN
```

---

# 12. Logging

Generate useful logs.

Include:

* HTTP method
* URL
* request payload
* response body
* response status
* duration

Logs should help diagnose failures without rerunning tests.

---

# 13. Flaky Test Prevention

Tests must:

* pass consistently
* avoid timing assumptions
* avoid random ordering
* avoid shared mutable state

Run suites multiple times to detect flaky tests.

Target:

```
5 consecutive runs
0 flaky tests
```

---

# 14. Tags

Support execution by tags.

Examples:

```
@smoke

@regression

@critical

@payment

@api
```

Smoke tests should execute quickly.

Regression tests should provide comprehensive coverage.

---

# 15. Error Messages

Assertions should provide meaningful failures.

Prefer:

```
Expected order status COMPLETED

Actual:

PROCESSING

Order ID:

12345
```

Avoid generic assertion failures.

---

# 16. Code Quality

Follow:

* DRY
* SOLID (where appropriate)
* consistent formatting
* lint clean
* no dead code
* no commented code
* no magic numbers

Functions should be small and focused.

---

# 17. CI/CD Compatibility

Generated code should support:

* parallel execution
* retries
* tagged execution
* HTML reporting
* JUnit reporting
* Allure reporting (if configured)

Tests must be deterministic in CI.

---

# 18. Security

Never hardcode:

* passwords
* API keys
* bearer tokens
* secrets

Use environment variables or secret management.

---

# 19. Project Scalability

Assume the project will grow to thousands of tests.

Organize code so that:

* new APIs are easy to add
* tests are easy to locate
* helpers are reusable
* maintenance cost remains low

---

# 20. AI Code Generation Rules

Whenever generating Playwright API code:

* Generate production-ready code.
* Prefer composition over duplication.
* Never generate hardcoded waits.
* Prefer expect.poll() for asynchronous business workflows.
* Keep API clients separate from test logic.
* Keep tests independent.
* Generate descriptive names.
* Use environment configuration.
* Produce deterministic tests.
* Generate maintainable code over minimal code.
* Follow enterprise architecture and coding standards.
* If multiple implementations are possible, choose the one that maximizes readability, maintainability, and long-term scalability.
