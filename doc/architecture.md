# TODOアプリ システムアーキテクチャ

> 関連ドキュメント: [設計書 (design-doc.md)](./design-doc.md)

---

## 1. システム構成図

```mermaid
graph TD
    subgraph Browser["🌐 Browser"]
        direction TB
        UI["🖥️ Pages / UI<br>────────────────<br>• Dashboard<br>• Task List<br>• Kanban Board"]
        BFF["⚡ API Routes - BFF層<br>────────────────<br>• /api/auth/*<br>• /api/tasks/*<br>• /api/tags/*"]
    end

    subgraph Backend["🖥️ Node.js Backend API Server"]
        direction TB
        AUTH["🔐 認証ミドルウェア<br>JWT検証"]
        LOGIC["⚙️ ビジネスロジック<br>タスクCRUD"]
        VALID["✅ バリデーション<br>Zod"]
    end

    subgraph DB["🗄️ PostgreSQL"]
        direction TB
        T_USERS["👤 users"]
        T_TASKS["📝 tasks"]
        T_TAGS["🏷️ tags"]
        T_TASK_TAGS["🔗 task_tags"]
    end

    UI --> BFF
    BFF -->|"HTTP/REST"| AUTH
    AUTH --> LOGIC
    LOGIC --> VALID
    VALID -->|"Prisma ORM"| T_USERS
    VALID -->|"Prisma ORM"| T_TASKS
    VALID -->|"Prisma ORM"| T_TAGS
    VALID -->|"Prisma ORM"| T_TASK_TAGS

    style Browser fill:#dbeafe,stroke:#3b82f6,color:#1e3a8a
    style Backend fill:#dcfce7,stroke:#22c55e,color:#14532d
    style DB fill:#fef9c3,stroke:#eab308,color:#713f12

    style UI fill:#bfdbfe,stroke:#3b82f6
    style BFF fill:#bfdbfe,stroke:#3b82f6
    style AUTH fill:#bbf7d0,stroke:#22c55e
    style LOGIC fill:#bbf7d0,stroke:#22c55e
    style VALID fill:#bbf7d0,stroke:#22c55e
    style T_USERS fill:#fef08a,stroke:#eab308
    style T_TASKS fill:#fef08a,stroke:#eab308
    style T_TAGS fill:#fef08a,stroke:#eab308
    style T_TASK_TAGS fill:#fef08a,stroke:#eab308
```

---

## 2. 技術スタック

| レイヤー | 技術                                                 |
|----------|----------------------------------------------------|
| フロントエンド | Next.js 16+ (App Router), TypeScript, Tailwind CSS |
| 状態管理 | React Query (TanStack Query)                       |
| バックエンド | Node.js + Express または Fastify                      |
| 認証 | JWT (jsonwebtoken) + bcrypt                        |
| ORM | Prisma                                             |
| データベース | PostgreSQL                                         |
| バリデーション | Zod                                                |

---

## 3. レイヤー詳細

### 3.1 フロントエンド (Next.js)

- **App Router** を使用し、ページ・レイアウト・APIルートを一元管理
- **API Routes (BFF)** がバックエンドAPIへのプロキシ兼セッション管理を担当
- **React Query** でサーバー状態のキャッシュ・取得・更新を管理

### 3.2 バックエンド (Node.js)

- **REST API** として設計し、Next.js BFF経由でのみアクセス
- **Prisma ORM** でPostgreSQLとの型安全なデータ操作
- **Zod** でリクエストボディのバリデーション

### 3.3 データベース (PostgreSQL)

- **Prisma Migrate** でスキーマ管理・マイグレーション
- タスクは論理削除（`deleted_at`）で管理
- ユーザーごとにデータを完全分離

---

## 4. 認証フロー

```mermaid
sequenceDiagram
    autonumber
    participant C as 🌐 Client (Browser)
    participant B as ⚡ Next.js BFF
    participant A as 🖥️ Backend API
    participant D as 🗄️ PostgreSQL

    rect rgb(219, 234, 254)
        Note over C,D: ログイン
        C->>B: POST /api/auth/login<br>(email, password)
        B->>A: POST /api/auth/login
        A->>D: ユーザー検索 & パスワード検証
        D-->>A: ユーザー情報
        A-->>B: JWT token
        B-->>C: Set-Cookie: token (HTTPOnly)
    end

    rect rgb(220, 252, 231)
        Note over C,D: 認証済みリクエスト
        C->>B: GET /api/tasks
        B->>A: GET /api/tasks<br>(Authorization: Bearer token)
        A->>A: JWT検証
        A->>D: タスク取得 (user_id で絞り込み)
        D-->>A: タスク一覧
        A-->>B: tasks data
        B-->>C: tasks data
    end
```

---

## 5. デプロイ構成（予定）

デプロイ先は未定。候補として以下を検討：

| 候補 | フロントエンド | バックエンド | DB |
|------|---------------|-------------|-----|
| Vercel + Railway | Vercel | Railway | Railway PostgreSQL |
| Vercel + Render | Vercel | Render | Render PostgreSQL |
| AWS | Amplify / CloudFront | ECS / Lambda | RDS |
