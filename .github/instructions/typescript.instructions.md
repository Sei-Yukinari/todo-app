---
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript / Next.js コーディング規約

## 型定義

- `any` 型は使用禁止。代替として `unknown` を使い、型ガードで絞り込む
- `interface` はオブジェクト形状の定義に使う。`type` はユニオン型・交差型・エイリアスに使う
- コンポーネントのpropsは `interface Props` として定義する
- APIレスポンス型は `lib/types/` に集約して再利用する

```ts
// ✅ 良い例
interface Props {
  task: Task;
  onUpdate: (id: string, data: UpdateTaskInput) => Promise<void>;
}

// ❌ 悪い例
const Component = ({ task, onUpdate }: any) => { ... }
```

## Next.js App Router

- コンポーネントはデフォルトでサーバーコンポーネント（RSC）
- `useState`, `useEffect`, イベントハンドラが必要な場合のみファイル先頭に `"use client"` を追加
- データフェッチはサーバーコンポーネントで行い、クライアントコンポーネントへはprops経由で渡す
- ページコンポーネントは `app/` 以下に配置し、`page.tsx` とする

## import順序

1. Node.js built-in モジュール
2. 外部ライブラリ（`react`, `next`, など）
3. 内部モジュール（`@/` エイリアス使用）
4. 型のみのimport（`import type`）

```ts
import { cache } from 'react';
import { cookies } from 'next/headers';

import { prisma } from '@/lib/prisma';
import { taskSchema } from '@/lib/schemas/taskSchema';

import type { Task } from '@/lib/types';
```

## クラスより関数を優先する

- `class` は使用禁止。関数（アロー関数・通常の関数）で記述する
- Reactコンポーネントは関数コンポーネントとして定義する
- ロジックの共通化はクラスではなくカスタムフックやユーティリティ関数で行う

```ts
// ✅ 良い例
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ja-JP');
};

const TaskCard = ({ task }: Props) => {
  return <div>{task.title}</div>;
};

// ❌ 悪い例
class TaskFormatter {
  format(date: Date): string {
    return date.toLocaleDateString('ja-JP');
  }
}
```

## Tailwind CSS

- インラインスタイル（`style={}`)は使用しない。Tailwindクラスで表現する
- 動的クラスは `clsx` または `cn` ユーティリティを使う
- コンポーネント固有のスタイルは `className` propで外部から注入できるようにする
