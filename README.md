# 📝 TODOアプリ

ブラウザで動く、シンプルで使いやすいタスク管理アプリです。
複数のユーザーがそれぞれ自分のタスクを作成・管理できます。

---

## ✨ 主な機能

| 機能 | 説明 |
|------|------|
| 🔐 ユーザー認証 | Firebase Authentication (Google, GitHub) — HTTPOnly セッションCookieで管理 |
| ✅ タスク管理 | タスクの作成・編集・削除・ステータス変更 |
| 🏷️ タグ・優先度 | タグや優先度（高/中/低）でタスクを整理 |
| 📅 期限管理 | 期限を設定し、期限切れタスクをハイライト表示 |
| 📋 リスト表示 | タグ・優先度・ステータスでフィルタリング可能 |
| 🗂️ カンバンボード | ドラッグ&ドロップでステータスを変更 |
| 📊 ダッシュボード | 今日期限のタスク・期限切れタスクをひと目で確認 |

---

## 🖥️ 技術スタック

| レイヤー    | 技術                                                                        |
|---------|---------------------------------------------------------------------------|
| フロントエンド | [Next.js 16+](https://nextjs.org/) (App Router), TypeScript, Tailwind CSS |
| 状態管理    | [TanStack Query](https://tanstack.com/query) (React Query)                |
| バックエンド  | Node.js + Express                                                         |
| 認証      | Firebase Authentication (Google, GitHub) — HTTPOnly セッションCookieで管理 |
| ORM     | [Prisma](https://www.prisma.io/)                                          |
| データベース  | PostgreSQL                                                                |
| バリデーション | [Zod](https://zod.dev/)                                                   |
| テスト     | [Vitest](https://vitest.dev/)                                                           |

---

## 🚀 セットアップ

> ⚠️ 現在開発中のため、セットアップ手順は後日追記予定です。

### 必要な環境

- Node.js 22+
- PostgreSQL

---

## 📁 ドキュメント

詳細な設計ドキュメントは [`doc/`](./doc/) フォルダを参照してください。

| ファイル | 内容 |
|----------|------|
| [design-doc.md](./doc/design-doc.md) | 機能要件・非機能要件の一覧 |
| [architecture.md](./doc/architecture.md) | システム構成図・認証フロー |
| [data-model.md](./doc/data-model.md) | データベースのテーブル定義・ER図 |
| [api-design.md](./doc/api-design.md) | APIエンドポイント一覧 |
| [ui-design.md](./doc/ui-design.md) | 画面構成・UIコンポーネント設計 |
| [security.md](./doc/security.md) | セキュリティ設計方針 |

---

## 🔒 セキュリティ

- パスワードは **bcrypt** でハッシュ化して保存
- 認証トークン（JWT）は **HTTPOnly Cookie** で管理（XSS対策）
- ユーザーは自分のタスクにのみアクセス可能
- 通信はすべて **HTTPS**

---

## 🗺️ 今後の拡張候補

- メール・プッシュ通知
- タスクへのコメント機能
- 他ユーザーへのタスク共有
- カレンダー表示
- モバイルアプリ対応

PR note: Created via Copilot CLI.

PR created via Copilot CLI at 2026-02-24T07:18:40Z

README: PR用の丁寧な説明を追加
