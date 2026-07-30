# Slow API Test Cases Analysis

This document identifies test cases across `export-users.spec.ts`, `upload-csv.spec.ts`, and `upload-avatar.spec.ts` that involve slow API operations, such as background processing, file handling, disk I/O, CSV parsing, heavy database transactions, or polling timeouts.

## Overview of Slow API Operations

Slow API operations typically fall into the following categories:

- **Data Export & Polling**: Aggregating large database records and processing export files.
- **CSV Parsing & Batch Database Transactions**: Uploading, parsing multipart CSV payloads, and executing batch DB updates.
- **Binary Image Upload & Disk Storage**: Processing multipart image binaries, writing files to server disk storage, and updating database references.

## Identified Test Cases

### Export Users Suite

File: [export-users.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/export-users.spec.ts)

- **`TC-EXP-01`: Admin should successfully export user list (200 OK)**
  - **Category**: Data Export & Polling
  - **Reason**: Performs data aggregation across user records in the database. Uses Playwright `expect().toPass()` polling mechanism with configured `POLL_TIMEOUT` and `POLL_INTERVAL` to handle non-instant API responses.

### Upload CSV Suite

File: [upload-csv.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/upload-csv.spec.ts)

- **`TC-CSV-01`: Owner should successfully update profile via CSV upload (200 OK)**
  - **Category**: CSV Parsing & Batch DB Transaction
  - **Reason**: Involves multipart request handling, parsing CSV file data, validating column headers, and executing database update transactions.
- **`TC-CSV-02`: Admin should successfully update any user profile via CSV (200 OK)**
  - **Category**: CSV Parsing & Batch DB Transaction
  - **Reason**: Involves multipart file transmission, server-side CSV parsing, user lookup, and database profile update execution.

### Upload Avatar Suite

File: [upload-avatar.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/upload-avatar.spec.ts)

- **`TC-AVT-01`: Owner should successfully upload PNG avatar (200 OK)**
  - **Category**: Binary File Processing & Disk Storage
  - **Reason**: Transmits binary image buffer over multipart form data, processes image server-side, writes file to `/uploads/avatars/` disk directory, and updates database avatar URL record.
- **`TC-AVT-02`: Admin should successfully upload avatar for any user (200 OK)**
  - **Category**: Binary File Processing & Disk Storage
  - **Reason**: Transmits binary image buffer, handles disk file storage write operations, and executes database user record updates.

## Summary Table

| Test Case ID | Test File | Test Title | Primary Slow Factor |
| --- | --- | --- | --- |
| `TC-EXP-01` | [export-users.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/export-users.spec.ts) | Admin should successfully export user list | DB Data Aggregation & Response Polling |
| `TC-CSV-01` | [upload-csv.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/upload-csv.spec.ts) | Owner should successfully update profile via CSV upload | Multipart CSV Parsing & DB Transaction |
| `TC-CSV-02` | [upload-csv.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/upload-csv.spec.ts) | Admin should successfully update any user profile via CSV | Multipart CSV Parsing & DB Transaction |
| `TC-AVT-01` | [upload-avatar.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/upload-avatar.spec.ts) | Owner should successfully upload PNG avatar | Binary Processing, File System Write & DB Update |
| `TC-AVT-02` | [upload-avatar.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/upload-avatar.spec.ts) | Admin should successfully upload avatar for any user | Binary Processing, File System Write & DB Update |
