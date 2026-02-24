# API セットアップ手順

このディレクトリは Todo アプリのバックエンド API を管理しています。以下の手順に従ってセットアップを行ってください。

## 1. 初期セットアップ

1. 必要な Node.js バージョンをインストールしてください（例: v22 以上推奨）。
2. このディレクトリに移動します。
   ```bash
   cd api/
   ```

## 2. 依存パッケージのインストール

```bash
npm install
```

## 3. Prisma の初期化

1. Prisma のセットアップ（初回のみ）
   ```bash
   npx prisma init
   ```
2. `prisma/schema.prisma` を編集し、データモデルを定義します。
3. マイグレーションを実行してデータベースを作成します。
   ```bash
   npx prisma migrate dev --name init
   ```
4. Prisma Client を生成します。
   ```bash
   npx prisma generate
   ```

## 4. 環境変数の設定

`.env` ファイルを作成し、データベース接続情報などを記載してください。

例:
```
DATABASE_URL="file:./dev.db"
```

## 5. API サーバーの起動

```bash
npm run dev
```

または本番環境用:
```bash
npm run build
npm start
```

---

## 参考リンク
- [Prisma 公式ドキュメント](https://www.prisma.io/docs/)
- [Node.js 公式サイト](https://nodejs.org/ja/)
