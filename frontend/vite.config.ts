import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Node.jsのpathモジュールを使用
import * as path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // プロジェクト内のすべての 'react' のインポートを、ルートにある 'react' のインスタンスに強制的にマップする
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },

  // 開発サーバー起動時に特定のパッケージを事前にバンドルさせる
  // これにより、依存関係の解決が安定することがあります。
  optimizeDeps: {
    include: [
      '@supabase/supabase-js',
      '@supabase/auth-ui-react',
      'react-router-dom',
    ]
  },
})
