---
applyTo: "front/src/app/api/**,api/src/**"
---

# APIルート / Zod / Prisma 規約

## APIルートの構造

Next.js App RouterのAPIルートは `app/api/[resource]/route.ts` に配置する。

```ts
// app/api/tasks/route.ts の基本構造
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  // 1. 認証検証
  const user = await verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
  }

  // 2. クエリパラメータのバリデーション（必要に応じて）

  // 3. Prismaでデータ取得
  try {
    const tasks = await prisma.task.findMany({ where: { userId: user.id } });
    return NextResponse.json({ data: tasks });
  } catch (error) {
    console.error('[GET /api/tasks]', error);
    return NextResponse.json({ error: { message: 'Internal Server Error' } }, { status: 500 });
  }
}
```

## Zodバリデーション

- リクエストボディは必ずZodでバリデーションする
- スキーマは `lib/schemas/` に定義し、APIルートとフォームで共有する
- バリデーションエラーは `400` で返し、エラー詳細を含める

```ts
const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

const body = await request.json();
const result = createTaskSchema.safeParse(body);
if (!result.success) {
  return NextResponse.json(
    { error: { message: 'Validation Error', details: result.error.flatten() } },
    { status: 400 }
  );
}
```

## Prisma利用ルール

- Prismaクライアントは `lib/prisma.ts` のシングルトンを使う
- クエリは必ずtry-catchで囲む
- ユーザーデータを取得する際は必ず `where: { userId: user.id }` でスコープを絞る（他ユーザーデータの漏洩防止）
- 論理削除フィールド（`deletedAt`）がある場合は `where: { deletedAt: null }` を必ず含める

## レスポンス形式

```ts
// 成功
{ data: T }

// エラー
{ error: { message: string; code?: string; details?: unknown } }
```

## HTTPステータスコード

| 状況 | コード |
|------|--------|
| 成功（取得・更新） | 200 |
| 成功（作成） | 201 |
| バリデーションエラー | 400 |
| 未認証 | 401 |
| 権限なし | 403 |
| リソース不存在 | 404 |
| サーバーエラー | 500 |
