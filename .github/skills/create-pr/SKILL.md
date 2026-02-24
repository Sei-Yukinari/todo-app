---
name: create-pr
description: Pull Requestを作成するためのスキル。コード変更が完了した後にPRを作成するよう求められたときに使用する。コミットメッセージの作成、PRタイトル・本文の生成、ラベル付けを自動化する。
---

# Pull Request 作成スキル

このスキルはコード変更からPull Requestを作成する手順を定義します。

## 手順

1. **作業用ブランチの作成（必須 — 作業前に実行）**

   作業を始める前に必ず新しいブランチを作成してください（例: `feat/short-desc`, `fix/short-desc`）。ブランチ名はプレフィックス/短い説明の形式にし、作業単位で切ることを推奨します:

   ```bash
   git checkout -b feat/your-short-desc
   git push -u origin HEAD
   ```

2. **変更内容の確認**

   `git diff` と `git status` で変更ファイルと差分を確認する。

2. **コミットメッセージの作成**

   以下の Conventional Commits 形式でコミットメッセージを作成する:

   ```
   <type>(<scope>): <summary>

   <body（任意）>
   ```

   **type の選択肢:**

   | type | 使用場面 |
   |------|---------|
   | `feat` | 新機能の追加 |
   | `fix` | バグ修正 |
   | `refactor` | リファクタリング（機能変更なし） |
   | `test` | テストの追加・修正 |
   | `docs` | ドキュメントの変更 |
   | `chore` | ビルド・設定ファイルの変更 |
   | `style` | コードスタイルの変更（動作に影響なし） |
   | `perf` | パフォーマンス改善 |

   **scope の例:** `auth`, `tasks`, `dashboard`, `api`, `db`

   コミットを実行する:
   ```bash
   git add -A
   git commit -m "<type>(<scope>): <summary>"
   ```

3. **ブランチをpushする**

   現在のブランチをリモートにpushする:
   ```bash
   git push origin HEAD
   ```

4. **PRタイトルと本文の生成**

   以下のテンプレートでPR本文を作成する:

   ```markdown
   ## 概要
   <!-- この変更が何をするのかを1〜2文で説明 -->

   ## 変更内容
   <!-- 箇条書きで変更点を列挙 -->
   -
   -

   ## 動作確認
   <!-- 確認した内容を記載 -->
   - [ ]
   - [ ]

   ## 関連Issue
   <!-- 関連するIssue番号があれば記載（例: Closes #123） -->
   ```

5. **PRの作成**

   GitHub CLI (`gh`) を使ってPRを作成する:
   ```bash
   gh pr create \
     --title "<PRタイトル>" \
     --body "<PR本文>" \
     --base main
   ```

   ドラフトPRとして作成する場合は `--draft` フラグを追加する。

6. **PR URLの確認**

   作成されたPRのURLをCLIで表示するかブラウザで開いて完了を確認します。例:

   ```bash
   # ブラウザで開く
   gh pr view --web
   ```

## 注意事項

- コミット前に `git status` で意図しないファイルが含まれていないか確認する
- `.env` や秘密情報を含むファイルがステージングされていないか確認する
- ベースブランチは原則 `main` とする（別途指示がある場合はそれに従う）
- PRタイトルもコミットメッセージと同様に Conventional Commits 形式を推奨する
