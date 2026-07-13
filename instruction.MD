# Front-end Instruction

## Goal

Generate a complete React + TypeScript frontend application based on:

- Use Case document
- API Design document
- Authentication flow
- Role-based access control

The generated project must be fully runnable.

---

# Folder Structure

```typescript
src/
│
├── api/
│
├── pages/
│
├── types/
├── utils/
│
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

---

# Requirements

## General

- No CSS
- No Tailwind
- No Bootstrap
- No Material UI
- No Chakra UI
- No styling libraries

Only functional React components.

Use TypeScript

---

## Follow Documents

The generated code MUST follow:

- Use Case document
- API Design document

Do not invent APIs.

Do not invent business logic.

---

## Routing

Use React Router

## Detail requirement for pages

{
  "learningPlan": [
    {
      "learningGoal": "Setup React + routing + auth flow FE",
      "tasks": [
        "Init React + TS, routing",
        "Trang Login/Register, lưu JWT, gọi API login"
      ],
      "expectedOutput": "Login thành công → vào dashboard; sai → hiện lỗi."
    },
    {
      "learningGoal": "Dashboard theo role + UI states (R7)",
      "tasks": [
        "Dashboard Admin vs User",
        "Thêm loading spinner + toast notification cho mọi async action"
      ],
      "expectedOutput": "Mọi call API có loading state + toast thành công/lỗi."
    },
    {
      "learningGoal": "Bảng users (R3) đọc từ MySQL (R2)",
      "tasks": [
        "Trang list users: search + sort + server-side pagination",
        "Data lấy thật từ API/MySQL"
      ],
      "expectedOutput": "Table search/sort/paginate đúng với data thật từ DB."
    },
    {
      "learningGoal": "Upload avatar + Export CSV (R6)",
      "tasks": [
        "Upload avatar (file input)",
        "Nút export danh sách user ra CSV"
      ],
      "expectedOutput": "Upload ảnh hiển thị; export CSV tải về đúng dữ liệu."
    },
    {
      "learningGoal": "Cài 'bẫy' R1 + R8",
      "tasks": [
        "Chừa 1 màn (vd Profile) KHÔNG gắn data-testid (ép dùng locator nâng cao sau này)",
        "Thêm 1 endpoint trả chậm có chủ đích ở dev mode (vd export delay 3s)",
        "Viết README + checklist requirement"
      ],
      "expectedOutput": "App full-stack chạy E2E thủ công OK; ghi chú rõ màn không-testid + endpoint chậm."
    }
  ],
  "appRequirements": [
    {
      "id": "R1",
      "requirement": "Một màn hình KHÔNG được chứa data-testid",
      "qaSkill": "Advanced locator strategies",
      "weeks": ["W3 (build)", "W8 (test)"]
    },
    {
      "id": "R2",
      "requirement": "Ít nhất 1 trang hiển thị dữ liệu lấy từ MySQL",
      "qaSkill": "UI vs DB validation",
      "weeks": ["W3", "W5", "W8"]
    },
    {
      "id": "R3",
      "requirement": "Bảng dữ liệu hỗ trợ search, sort, server-side pagination",
      "qaSkill": "Complex assertions",
      "weeks": ["W3", "W5", "W8"]
    },
    {
      "id": "R5",
      "requirement": "Ứng dụng hỗ trợ vai trò Admin và User",
      "qaSkill": "Authorization testing",
      "weeks": ["W2", "W5"]
    },
    {
      "id": "R6",
      "requirement": "Có chức năng file upload và CSV export",
      "qaSkill": "File handling automation",
      "weeks": ["W3", "W8"]
    },
    {
      "id": "R7",
      "requirement": "Có loading spinner và toast notification",
      "qaSkill": "Synchronization handling",
      "weeks": ["W3", "W8"]
    },
    {
      "id": "R8",
      "requirement": "1 API endpoint cố tình trả chậm ở dev mode",
      "qaSkill": "Wait strategy training",
      "weeks": ["W3", "W6", "W8"]
    },
    {
      "id": "R9",
      "requirement": "Có database seed script cho automation lặp lại được",
      "qaSkill": "Test data management",
      "weeks": ["W2", "W6", "W7"]
    },
    {
      "id": "R10",
      "requirement": "Không cho phép hardcoded wait trong test",
      "qaSkill": "Best practices",
      "weeks": ["W6", "W8", "W10"]
    },
    {
      "id": "R11",
      "requirement": "Automation validate tính nhất quán UI / API / Database",
      "qaSkill": "Full-stack QA skills",
      "weeks": ["W5", "W8", "W10"]
    }
  ]
}
