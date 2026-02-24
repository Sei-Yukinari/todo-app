# TODOアプリ 画面設計

> 関連ドキュメント: [設計書 (design-doc.md)](./design-doc.md)

---

## 1. 画面一覧

| 画面名 | パス | 説明 |
|--------|------|------|
| ログイン | `/login` | メール・パスワードでログイン |
| 新規登録 | `/register` | ユーザー作成 |
| ダッシュボード | `/` | 期限切れ・今日期限・サマリ表示 |
| タスクリスト | `/tasks` | タスク一覧（リスト表示）|
| カンバン | `/tasks/kanban` | タスク一覧（カンバン表示）|

---

## 2. 画面遷移

```mermaid
flowchart TD
    Login["🔑 /login\nログイン"]
    Register["📝 /register\n新規登録"]
    Dashboard["🏠 /\nダッシュボード"]
    TaskList["📋 /tasks\nタスクリスト"]
    Kanban["🗂️ /tasks/kanban\nカンバン"]
    Modal["🔍 タスク詳細\n（モーダル）"]

    Login -->|"認証成功"| Dashboard
    Register -->|"登録成功"| Dashboard
    Dashboard --> TaskList
    Dashboard --> Kanban
    TaskList --> Modal
    Kanban --> Modal

    style Login fill:#dbeafe,stroke:#3b82f6
    style Register fill:#dbeafe,stroke:#3b82f6
    style Dashboard fill:#dcfce7,stroke:#22c55e
    style TaskList fill:#fef9c3,stroke:#eab308
    style Kanban fill:#fef9c3,stroke:#eab308
    style Modal fill:#f3e8ff,stroke:#a855f7
```

---

## 3. 主要コンポーネント構成

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/
│   ├── layout.tsx          ← ナビゲーションバー
│   ├── page.tsx            ← ダッシュボード
│   └── tasks/
│       ├── page.tsx        ← タスクリスト
│       └── kanban/page.tsx ← カンバンボード
└── api/
    ├── auth/
    │   ├── register/route.ts
    │   ├── login/route.ts
    │   └── logout/route.ts
    └── tasks/
        ├── route.ts        ← GET (一覧), POST (作成)
        └── [id]/route.ts   ← GET, PUT, DELETE
```
