---
applyTo: "front/src/app/**,front/src/components/**,front/src/hooks/**,front/src/lib/**"
---

# Next.js (App Router) コーディング規約

## ディレクトリ構成

```
app/
├── (auth)/                  # 認証ページグループ（URLに影響しない）
│   ├── login/page.tsx
│   └── register/page.tsx
├── dashboard/page.tsx
├── tasks/
│   ├── page.tsx             # タスク一覧
│   └── [id]/page.tsx        # タスク詳細
├── api/                     # APIルート（BFF）
│   ├── auth/route.ts
│   └── tasks/route.ts
└── layout.tsx               # ルートレイアウト
components/
├── ui/                      # 汎用UIコンポーネント（ボタン・モーダル等）
└── tasks/                   # タスク固有コンポーネント
```

## サーバーコンポーネント vs クライアントコンポーネント

- コンポーネントは**デフォルトでサーバーコンポーネント（RSC）**として作成する
- 以下の場合のみファイル先頭に `"use client"` を追加する:
  - `useState` / `useEffect` / `useReducer` などのReact Hooksを使う
  - `onClick` などのイベントハンドラを直接持つ
  - ブラウザ専用API（`window`, `localStorage` など）を使う

```tsx
// ✅ サーバーコンポーネント（デフォルト）
// app/tasks/page.tsx
import { prisma } from '@/lib/prisma';

const TasksPage = async () => {
  const tasks = await prisma.task.findMany();
  return <TaskList tasks={tasks} />;
};

export default TasksPage;

// ✅ クライアントコンポーネント（必要な場合のみ）
// components/tasks/TaskStatusButton.tsx
"use client";

import { useState } from 'react';

const TaskStatusButton = ({ taskId }: { taskId: string }) => {
  const [loading, setLoading] = useState(false);
  // ...
};
```

## データフェッチ

- サーバーコンポーネントでは `async/await` で直接データを取得する
- クライアントコンポーネントでのデータ取得には **TanStack Query** を使う（`fetch` の直書き禁止）
- `loading.tsx` / `error.tsx` を使ってローディング・エラーUIを分離する

```tsx
// ✅ クライアントサイドのデータ取得
import { useQuery } from '@tanstack/react-query';

const useTasks = () =>
  useQuery({
    queryKey: ['tasks'],
    queryFn: () => fetch('/api/tasks').then((r) => r.json()),
  });
```

## ルートレイアウトとメタデータ

- 各ページのメタデータは `export const metadata` または `generateMetadata` で定義する
- `<head>` タグを直接書かない

```tsx
// app/tasks/page.tsx
export const metadata = {
  title: 'タスク一覧 | TODOアプリ',
};
```

## APIルート（Route Handlers）

- `app/api/[resource]/route.ts` に配置する
- HTTPメソッドごとに名前付きエクスポート（`GET`, `POST`, `PUT`, `DELETE`, `PATCH`）を使う
- 必ず認証チェックを最初に行う
- 詳細は `.github/instructions/api.instructions.md` を参照

```ts
// app/api/tasks/route.ts
export async function GET(request: NextRequest) { ... }
export async function POST(request: NextRequest) { ... }
```

## エラーハンドリング

- `app/error.tsx`（クライアントコンポーネント）でページレベルのエラーをキャッチする
- `notFound()` を使って404を返す（`redirect` / `notFound` は `next/navigation` からimport）

```tsx
// app/tasks/[id]/page.tsx
import { notFound } from 'next/navigation';

const TaskDetailPage = async ({ params }: { params: { id: string } }) => {
  const task = await prisma.task.findUnique({ where: { id: params.id } });
  if (!task) notFound();
  return <TaskDetail task={task} />;
};
```

## 環境変数

- サーバー専用の変数は `NEXT_PUBLIC_` プレフィックスを付けない（クライアントに露出しない）
- クライアントに公開してよい変数のみ `NEXT_PUBLIC_` を付ける
- `.env.local` は `.gitignore` に含め、コミットしない
