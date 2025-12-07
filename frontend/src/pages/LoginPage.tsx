import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { useAuthSession } from '../hooks/useAuthSession';
import { Navigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
    const { isAuthenticated, loading } = useAuthSession();

    // ロード中は何もしない
    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <p>認証状態を確認中…</p>
            </div>
        );
    }

    // すでにログイン済みの場合はルート（/）にリダイレクト
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // 未ログインの場合は認証UIを表示
    return (
        <div className='p-4 sm:p-8 max-w-lg mx-auto h-screen flex flex-col justify-center'>
            <h1 className='text-3xl font-bold mb-8 text-center'>
                料理ログへようこそ
            </h1>

            {/* Supabase Auth UIのメインコンポーネント */}
            <Auth
                supabaseClient={supabase}
                providers={['google']}
                view='sign_in'
                appearance={{ theme: ThemeSupa }}
                // 任意：追加のクラスやスタイルをTailwindで指定
                // 注意: Auth UI内の要素には適用されない場合があります
                // className="p-4 border border-gray-200 rounded-lg shadow-lg"
            />
        </div>
    );
};
