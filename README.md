🍳 Cooking Log App – 開発用 README（Vite + React + Supabase）
📦 プロジェクト構成
cooking-log-app/
└── frontend/        # React + Vite のフロントエンド

🚀 セットアップ手順
1. Clone（またはフォルダ準備）

任意の場所にプロジェクトフォルダを作成：

cooking-log-app/

🌐 2. フロントエンドの初期化（Vite + React）

プロジェクト直下で：

npx create-vite@latest frontend --template react-ts

📥 3. 依存関係インストール
cd frontend
npm install

🧰 4. 開発環境の起動
npm run dev


ブラウザで以下が開く：

👉 http://localhost:5173

（Vite のデフォルトポート）

🔌 5. Supabase との接続設定

まず Supabase SDK を追加：

npm install @supabase/supabase-js

🔧 src/lib/supabase.js（または .ts）を作成：
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

🔑 6. 環境変数設定

frontend/.env を作って以下を記述：

VITE_SUPABASE_URL=https://bldwshcxdtksnbsdxhdf.supabase.co
VITE_SUPABASE_KEY=sb_publishable_FD_jJmaITWaVp84EB9ymWw__Ov6RqWG


Supabase の Project Settings → API Keys から取得。

🧪 7. React Routerの導入

npm install react-router-dom


🧪 7. Tailwind.cssの導入

npm install @tailwindcss/vite

@tailwindcss/viteのインポート

vite.config.js :
+ import tailwindcss from '@tailwindcss/vite'
+ plugins: [react(), tailwindcss()],

index.css :
@import 'tailwindcss';



ーVervelデプロイ
・開始方法
　1. vercel.com(https://vercel.com/)にアクセスしてGitリポジトリを入力
　2. Git Scopeでinstallを行ってvercelとGitを接続　その後Create
　3. Root directoryでfrontendを設定
　4. Environment VariablesでSUPABASE_URLとKEYを設定