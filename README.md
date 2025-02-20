This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# HealthTracker - 健康管理アプリ

Next.jsとSupabaseを使用した健康管理アプリケーション。日々の健康データを記録・管理し、より健康的な生活をサポートします。

## 機能

- ユーザー認証
- 健康データの記録と管理
  - バイタルサイン（体重、血圧、体温など）
  - 運動記録
  - 睡眠記録
  - 食事記録
- 目標設定と進捗管理
- 健康スコアの可視化
- データ分析とインサイト

## 技術スタック

- **フロントエンド**
  - Next.js
  - TypeScript
  - Tailwind CSS
  - HeadlessUI
  - Chart.js

- **バックエンド**
  - Supabase
  - PostgreSQL

## 開発環境のセットアップ

1. リポジトリのクローン
```bash
git clone [repository-url]
cd health-tracker
```

2. 依存関係のインストール
```bash
npm install
```

3. 開発サーバーの起動
```bash
npm run dev
```

4. ブラウザで開く
```
http://localhost:3000
```

## 環境変数の設定

1. `.env.local`ファイルを作成
2. 必要な環境変数を設定
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## コントリビューション

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

[MIT License](LICENSE)
