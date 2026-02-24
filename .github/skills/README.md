# Skills

このディレクトリはGitHub Copilot CLIのカスタムスキルを配置する場所です。

## スキルとは

スキルは、Copilotが特定のタスクを実行するための指示・スクリプト・リソースのセットです。
インストラクション（指示）やプロンプト（テンプレート）より高機能で、実行可能なスクリプトを含められます。

## 配置規則

スキルは以下の構成で配置します:

```
skills/
└── [skill-name]/
    ├── skill.md        # スキルの定義・説明
    └── scripts/        # 実行スクリプト（オプション）
        └── run.sh
```

## 追加済みスキル

- `create-pr` — コード変更からPull Requestを作成するスキル（Conventional Commits形式のコミット・PR本文生成）

## 追加予定のスキル

- `db-migrate` — Prismaマイグレーション実行・確認スキル
- `generate-types` — Prismaスキーマからの型生成スキル
- `seed-db` — 開発用シードデータ投入スキル
- `create-pr` — GitHub CLIを使ったPR作成スキル
- `check-deps` — 依存関係の脆弱性チェックス
- `prettier` — コードフォーマットスキル
