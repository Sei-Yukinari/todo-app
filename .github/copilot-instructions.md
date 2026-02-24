# GitHub Copilot カスタム指示 — TODOアプリ

このファイルはGitHub Copilot CLIがこのリポジトリで作業する際に常時適用される指示です。

---

## プロジェクトコンテキスト

- **Next.js 16+ App Router** を使用。`pages/` ディレクトリは使用しない
- **Prisma** を通じてPostgreSQLにアクセスする。生のSQLクエリは使用しない
- **Zod** でAPIリクエスト・フォーム入力のバリデーションを行う
- **TanStack Query** でサーバー状態を管理する（クライアント側でのfetch直書きは避ける）
- **JWT** はHTTPOnly Cookieで管理する。LocalStorageには保存しない

---

## コード生成時の優先ルール

1. TypeScriptの型を必ず付ける。型推論が効かない場合は明示的に型注釈を書く
2. `async/await` を使い、Promiseチェーンは避ける
3. エラーハンドリングは必ず実装する（try-catch または Result型パターン）
4. APIレスポンスは統一フォーマットを使う:
   ```ts
   // 成功時
   { data: T }
   // エラー時
   { error: { message: string; code?: string } }
   ```
5. コンポーネントのpropsは必ずinterfaceで定義する
6. テストコードは実装コードと同じディレクトリに `*.test.ts(x)` として配置する

---

## ファイル命名規則

| 種別 | 規則 | 例 |
|------|------|----|
| コンポーネント | PascalCase | `TaskCard.tsx` |
| フック | camelCase, `use`プレフィックス | `useTaskList.ts` |
| ユーティリティ | camelCase | `formatDate.ts` |
| APIルート | Next.js規則 | `app/api/tasks/route.ts` |
| Zodスキーマ | camelCase + `Schema`サフィックス | `taskSchema.ts` |

---

## 参考ドキュメント

作業前に以下のドキュメントを確認すること:
- `doc/architecture.md` — システム全体像
- `doc/api-design.md` — APIエンドポイント仕様
- `doc/data-model.md` — データモデル・テーブル定義
