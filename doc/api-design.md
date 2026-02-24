# TODOアプリ API設計

> 関連ドキュメント: [設計書 (design-doc.md)](./design-doc.md)

---

## 1. 認証API

| メソッド | エンドポイント | 説明 | 認証 |
|----------|---------------|------|------|
| POST | `/api/auth/register` | ユーザー登録 | 不要 |
| POST | `/api/auth/login` | ログイン | 不要 |
| POST | `/api/auth/logout` | ログアウト | 必要 |
| GET | `/api/auth/me` | 現在のユーザー情報取得 | 必要 |

---

## 2. タスクAPI

| メソッド | エンドポイント | 説明 | 認証 |
|----------|---------------|------|------|
| GET | `/api/tasks` | タスク一覧（フィルタ・ソート対応） | 必要 |
| POST | `/api/tasks` | タスク作成 | 必要 |
| GET | `/api/tasks/:id` | タスク詳細取得 | 必要 |
| PUT | `/api/tasks/:id` | タスク更新 | 必要 |
| DELETE | `/api/tasks/:id` | タスク削除（論理削除） | 必要 |
| PATCH | `/api/tasks/:id/status` | ステータスのみ更新 | 必要 |

### GET /api/tasks クエリパラメータ

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| `status` | string | フィルタ: todo / in_progress / done |
| `priority` | string | フィルタ: low / medium / high |
| `tag_id` | string | タグIDでフィルタ |
| `due_before` | date | 期限でフィルタ（〜以前） |
| `sort` | string | ソート: due_date / priority / created_at |

---

## 3. タグAPI

| メソッド | エンドポイント | 説明 | 認証 |
|----------|---------------|------|------|
| GET | `/api/tags` | タグ一覧取得 | 必要 |
| POST | `/api/tags` | タグ作成 | 必要 |
| DELETE | `/api/tags/:id` | タグ削除 | 必要 |
