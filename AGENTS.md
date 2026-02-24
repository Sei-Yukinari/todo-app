# AGENTS.md — 全AIエージェント共通指示

このファイルはClaude, Gemini, OpenAI Codex, GitHub Copilot など全てのAIエージェントに適用される共通指示です。

---

## プロジェクト概要

TODOアプリ。複数ユーザーが各自のタスクを管理するWebアプリケーション。

---

## 技術スタック

| レイヤー | 技術                                                 |
|----------|----------------------------------------------------|
| フロントエンド | Next.js 16+ (App Router), TypeScript, Tailwind CSS |
| 状態管理 | TanStack Query (React Query)                       |
| バックエンド | Node.js + Express または Fastify                      |
| 認証 | Firebase Authentication (Google, GitHub) — セッション管理: HTTPOnly セッションCookie（firebase-admin createSessionCookie） |
| ORM | Prisma                                             |
| データベース | PostgreSQL                                         |
| バリデーション | Zod                                                |

---

## ディレクトリ構成（予定）

```
todo-app/
├── .github/
├── api/                    # web API（Express）
│   ├── prisma/             # Prismaクライアント
│   ├── src/
│   │   ├── presentation/   # プレゼンテーション層（コントローラー・ルート）
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── dto/        # リクエスト/レスポンスDTO
│   │   │   └── routes/
│   │   ├── application/    # アプリケーション層（ユースケース）
│   │   │   ├── usecases/
│   │   │   └── mappers/    # エンティティ↔DTOマッパー
│   │   ├── domain/         # ドメイン層（ビジネスロジック・エンティティ）
│   │   │   ├── entities/
│   │   │   ├── valueobjects/
│   │   │   └── repositories/ # リポジトリインターフェース
│   │   ├── infrastructure/ # インフラストラクチャ層
│   │   │   ├── repositories/ # リポジトリ実装
│   │   │   ├── database/
│   │   │   ├── services/   # 外部サービス連携
│   │   │   └── config/
│   │   ├── shared/         # 共有ユーティリティ
│   │   │   ├── utils/
│   │   │   ├── constants/
│   │   │   └── errors/
│   │   └── index.ts        # エントリーポイント
│   ├── Dockerfile          # APIサーバー用Dockerfile
│   └── package.json
├── front/                  # フロントエンド（Next.js）
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   │   ├── (auth)/     # 認証ルートグループ
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── signup/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── (dashboard)/ # メインアプリケーションルートグループ
│   │   │   │   ├── tasks/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   ├── profile/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── api/        # API Routes
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login/route.ts
│   │   │   │   │   ├── signup/route.ts
│   │   │   │   │   └── logout/route.ts
│   │   │   │   ├── tasks/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/route.ts
│   │   │   │   └── middleware.ts
│   │   │   ├── error.tsx
│   │   │   ├── not-found.tsx
│   │   │   ├── layout.tsx  # ルートレイアウト
│   │   │   └── page.tsx    # ホームページ
│   │   ├── components/     # Reactコンポーネント
│   │   │   ├── ui/         # 基本UIコンポーネント
│   │   │   ├── features/   # 機能別コンポーネント
│   │   │   └── common/     # 共通コンポーネント
│   │   ├── hooks/          # カスタムフック
│   │   │   └── queries/    # TanStack Query hooks
│   │   ├── lib/            # ユーティリティ・設定
│   │   │   ├── api/        # API呼び出し関数
│   │   │   ├── auth/       # 認証ユーティリティ
│   │   │   ├── schemas/    # Zodスキーマ
│   │   │   └── utils/      # ヘルパー関数
│   │   ├── styles/         # Tailwind CSS設定
│   │   │   └── globals.css
│   │   ├── types/          # TypeScript型定義
│   │   └── constants/      # 定数
│   ├── public/             # 静的ファイル
│   ├── Dockerfile          # フロントエンド用Dockerfile
│   └── package.json
├── lib/                    # ユーティリティ・設定
├── prisma/                 # Prismaスキーマ・マイグレーション
└── doc/                    # 設計ドキュメント
```

---

## コーディング規約

- TypeScriptの`any`型は使用禁止。`unknown`または適切な型を使うこと
- `console.log`は本番コードに残さない（デバッグ用途のみ、コミット前に削除）
- コンポーネントはサーバーコンポーネントをデフォルトとし、クライアント機能が必要な場合のみ`"use client"`を付与
- Zodスキーマは`lib/schemas/`に集約し、APIルートとフォームで共有する
- Prismaクエリは必ずtry-catchで囲み、エラーをログに記録する
- 認証が必要なAPIルートは必ずJWT検証ミドルウェアを適用する

---

## 禁止事項

- `eval()` の使用禁止
- SQLインジェクション対策なしの生クエリ禁止
- 秘密情報（APIキー・パスワード）のハードコード禁止
- `dangerouslySetInnerHTML` の無条件使用禁止

---

## ドキュメント参照

詳細な設計は `doc/` 以下を参照:
- `doc/design-doc.md` — 機能要件・非機能要件
- `doc/architecture.md` — システム構成図・認証フロー
- `doc/data-model.md` — ERD・テーブル定義
- `doc/api-design.md` — APIエンドポイント仕様
- `doc/security.md` — セキュリティ設計
