# Test Data Strategy Document

## Executive Summary

This document outlines the test data strategy for the `Playwright-Test` framework. The primary goal is to establish a robust, repeatable, and scalable approach for test data provisioning, dynamic generation, state isolation, execution logging, and automated cleanup across API test suites.

## Scope of Test Data Management

### In Scope

- Automated database seeding of baseline accounts (admin and 50 standard users).
- Dynamic runtime test data creation using faker libraries and builder patterns.
- Data-driven test datasets for positive, negative, and edge-case API tests.
- Transient test data cleanup post-test execution.
- Environmental data isolation for parallel execution.

### Out of Scope

- Production data masking or production database cloning.
- Performance and stress-test dataset creation.
- Long-term state persistence across multiple test runs.

## Tools and Technology Stack for Test Data

| Category | Tool / Dependency | Purpose |
| --- | --- | --- |
| Seeding & Connection | `mysql2` | Connects directly to MySQL to seed and clean tables |
| Data Generation | `@faker-js/faker` | Generates randomized, realistic mock attributes |
| Schema Validation | `zod` | Validates data shapes against expected models |
| Design Pattern | Builder Pattern | Enables fluent construction of test data models |
| Script Execution | `tsx` | Runs TypeScript setup scripts (`src/data/seed.ts`) |

## Test-data Management

### Data Provisioning and Seeding

- **Pre-Test Database Seeding**: Executed via `src/data/seed.ts` in Playwright's `globalSetup`.
- **Baseline Data**: Inserts 1 immutable admin user (`admin123`) and 50 baseline user accounts (`username01` to `username50`).
- **Idempotent Operations**: Uses MySQL `ON DUPLICATE KEY UPDATE` queries to prevent duplicate key errors upon test re-runs.

### Dynamic Data Generation

- **Faker Integration**: Uses `@faker-js/faker` inside `src/data/helpers/generators/` to create unique runtime values (names, emails, phones).
- **Builder Pattern**: Uses `UserBuilder` inside `src/data/helpers/builders/` for flexible object creation with default fallback values.

### Data-Driven Testing Datasets

- **Predefined Datasets**: Static test datasets located in `src/data/test_data/` (e.g., `login.dataset.ts`, `api.test.data.ts`) supply parameterized inputs.
- **Validation Schemas**: Zod schemas validate dataset payloads before sending API requests.

### Data Isolation and State Management

- **Worker Isolation**: Unique test accounts and dynamic data avoid race conditions during parallel worker execution (`fullyParallel: true`).
- **Transient Data Prefixing**: Dynamically created test records use a `test` prefix in the `username` field for easy identification.

### Data Cleanup and Teardown

- **Post-Test Teardown**: Executed via `src/data/cleanup.ts` in Playwright's `globalTeardown`.
- **Targeted Purge**: Executes `DELETE FROM users WHERE username LIKE 'test%'` to remove only transient test accounts, preserving baseline data.

## Data Lifecycle Overview

| Stage | Mechanism / Location | Responsibility |
| --- | --- | --- |
| Setup | `src/data/seed.ts` | Truncates table and seeds baseline user accounts |
| Generation | `src/data/helpers/generators/`, `src/data/helpers/builders/` | Generates dynamic runtime objects |
| Parameterization | `src/data/test_data/` | Supplies data arrays for data-driven tests |
| Cleanup | `src/data/cleanup.ts` | Deletes transient records with `test%` prefix |

## Test Data Execution and Reporting

### Execution Scripts

- **Standalone Data Seeding**: `npm run seed` (executes `npx tsx src/data/seed.ts`)
- **Automated Lifecycle**: Seeding runs automatically in `globalSetup` and cleanup runs in `globalTeardown` when executing `npm run test:api`.

### Reporting and Logging

- **Console Seeding Logs**: Detailed logs printed during setup confirming database connection and count of seeded records.
- **Console Cleanup Logs**: Post-test execution output logging the number of affected rows deleted.
- **Error Reporting**: Failures in setup or teardown bubble up to Playwright reporters to prevent false test runs on dirty database states.

## Risk Management and Governance

- **No Production PII**: Synthetic data generated via `@faker-js/faker` ensures zero real user data leakage.
- **Environment Isolation**: Database credentials and hosts are configured strictly via environment variables (`.env`).
- **Flaky Data Prevention**: Parallel tests use isolated dynamic usernames to prevent state contamination between workers.
