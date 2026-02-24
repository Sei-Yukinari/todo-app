# 開発フロー

## 開発手順

1. ブランチを切る
   - 機能ごとに分かりやすいブランチ名（例: feature/add-task、fix/auth-bug）を付けて作業する。
2. ローカルでの起動と確認
   - make up でDockerコンテナ（API/DB）を起動し、自動マイグレーションが走ることを想定する。
   - frontは `make dev-front` 起動して動作確認を行う。
3. コード品質チェック
   - `npm run lint:fix` で自動修正を行い、`npm run format` でフォーマットを揃える。
   - `npm run build`（バックエンド・フロントエンド両方）を実行してコンパイルエラーがないことを確認する。
4. テスト
   - ユニットテストやAPIルートのテストがある場合はローカルで実行して成功することを確認する。
5. コミットとPR作成
   - 小さな意味ある単位でコミットする。PRには変更の目的と影響範囲を明記する。

## コマンド

### Docker操作（Makefile）

- `make up` - コンテナ起動（DB含む、自動マイグレーション）
- `make down` - コンテナ停止
- `make logs` - 全コンテナのログ確認
- `make logs-db` - DBログ確認
- `make ps` - コンテナ一覧表示
- `make exec-backend` - バックエンドコンテナに入る
- `make exec-db` - データベースに接続する

### データベース操作（Prisma）

- `make db-migrate` - マイグレーションを実行
- `make db-migrate-dev` - 開発用マイグレーションの作成・実行
- `make db-generate` - Prisma Client を生成
- `make db-reset` - データベースを開発用にリセット
- `make db-studio` - Prisma Studio を起動（GUI）

### 開発用スクリプト

- `npm run backend:dev` - バックエンド開発サーバー起動
- `npm run backend:build` - バックエンドをビルド（本番前チェック）
- `npm run frontend:dev` - フロントエンド開発サーバー起動
- `npm run frontend:build` - フロントエンドをビルド
- `npm run openapi:generate` - OpenAPI からクライアント生成（該当プロジェクトで使用する場合）

## コミット前チェックリスト

- lint とフォーマット
  - コードは必ず `npm run lint:fix` と `npm run format` を実行する。
- ビルド確認
  - `npm run build`（両者）を実行してコンパイルエラーがないことを確認する。
- テスト
  - 変更に関連するテストを実行し、すべてパスすることを確認する。
- シークレット
  - `.env.local` などの環境変数ファイルはコミットしない（.gitignore を確認）。

## 補足（プロジェクト向け）

- Prisma の操作は `lib/prisma` のシングルトンを想定しているため、Client の再生成やマイグレーション実行後は `make db-generate` を実行すること。
- Next.js（App Router）を使用しているため、フロント側のルーティングや API の変更はフロントビルドでの確認も忘れずに行う。
- ローカルで外部サービス（認証プロバイダ等）を必要とする場合は、.env の設定方法やモック手順を README に追記すること。

以上を標準的な開発手順として共有し、必要に応じてチームで補強してください。
