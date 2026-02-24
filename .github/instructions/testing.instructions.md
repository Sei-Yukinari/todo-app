---
applyTo: "**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx"
---

# テスト記述ルール（Vitest）

## テストファイルの配置

- テストファイルは実装ファイルと同じディレクトリに配置する
- ファイル名: `[対象ファイル名].test.ts(x)` または `[対象ファイル名].spec.ts(x)`

```
components/
├── TaskCard.tsx
└── TaskCard.test.tsx
```

## テスト構造

- `describe` でテスト対象をグループ化する
- `it` または `test` のテスト名は「〜すること」「〜できること」の形で記述する
- Arrange / Act / Assert（AAA）パターンで記述する

```ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskCard } from './TaskCard';

describe('TaskCard', () => {
  it('タスクのタイトルを表示すること', () => {
    // Arrange
    const task = { id: '1', title: 'テストタスク', status: 'todo' };

    // Act
    render(<TaskCard task={task} />);

    // Assert
    expect(screen.getByText('テストタスク')).toBeInTheDocument();
  });
});
```

## モック方針

- 外部依存（Prisma, fetch, 認証）は必ず `vi.mock()` でモックする
- `vi.fn()` でスパイ関数を作成する
- テスト間でモックの状態が漏れないよう `beforeEach` で `vi.clearAllMocks()` を呼ぶ

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    task: {
      findMany: vi.fn(),
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});
```

## 日時のモック

- `vi.setSystemTime()` で現在時刻を固定する
- テスト後は `vi.useRealTimers()` でリストアする

```ts
import { beforeEach, afterEach, vi } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2024-01-01'));
});

afterEach(() => {
  vi.useRealTimers();
});
```

## APIルートのテスト

- `Request` オブジェクトを直接生成してRoute Handlerをテストする
- 認証が必要なルートはJWT検証を `vi.mock()` でモックする
- エラーケース（バリデーションエラー・未認証・DBエラー）を必ずテストする

```ts
import { describe, it, expect, vi } from 'vitest';
import { GET, POST } from './route';

vi.mock('@/lib/auth', () => ({
  verifyAuth: vi.fn().mockResolvedValue({ id: 'user-1' }),
}));

describe('GET /api/tasks', () => {
  it('認証済みユーザーのタスク一覧を返すこと', async () => {
    const request = new Request('http://localhost/api/tasks');
    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.data).toBeDefined();
  });

  it('未認証の場合に401を返すこと', async () => {
    const { verifyAuth } = await import('@/lib/auth');
    vi.mocked(verifyAuth).mockResolvedValueOnce(null);

    const request = new Request('http://localhost/api/tasks');
    const response = await GET(request);

    expect(response.status).toBe(401);
  });
});
```

## カバレッジ目標

- ビジネスロジック・APIルート: 80%以上
- UIコンポーネント: 主要インタラクション・エラー状態をカバー
- `vitest --coverage` でカバレッジを計測する（`@vitest/coverage-v8` 使用）
