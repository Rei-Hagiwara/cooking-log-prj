import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthSession } from '../hooks/useAuthSession';
import { Button } from '../components/ui/button';
import { GoogleIcon } from "../components/ui/svgs/icon-Google";
import { LoadingSpinner } from "../components/ui/svgs/loadingSpinner";

export const LoginPage: React.FC = () => {
    const { isAuthenticated, loading: sessionLoading} = useAuthSession();
    const [isLoginProcessing, setIsLoginProcessing] = useState(false);

    // ロード中は何もしない
    if (sessionLoading) {
        return (
 <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-stone-800 dark:to-zinc-900">
        {/* 標準の transition と opacity を使い、React のマウント時にふわっとさせる */}
        <div className="flex flex-col items-center space-y-4 transition-opacity duration-700 ease-in-out">
          <div className="relative">
            {/* メインアイコン */}
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg relative z-10">
              <svg
                className="w-8 h-8 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            
            {/* スピナー：標準の animate-spin を使用 */}
            <div className="absolute -inset-2 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
          
          <div className="text-center space-y-1">
            <p className="text-lg text-gray-500 font-medium text-foreground tracking-wider">
              Cooking Log
            </p>
            {/* テキスト明滅：標準の animate-pulse を使用 */}
            <p className="text-sm text-muted-foreground animate-pulse">
              認証状態を確認中...
            </p>
          </div>
        </div>
      </div>
        );
    }

    // すでにログイン済みの場合はルート（/）にリダイレクト
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Googleログイン処理
    const handleGoogleSignIn = async () => {
        setIsLoginProcessing(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    // ログイン後のリダイレクト先
                    redirectTo: window.location.origin,
                },
            });

            if (error) {
                throw error;
            }
        } catch (err: any) {
            console.error('Google sign in error:', err);
            alert(`ログインエラー： ${err.message}`);
            setIsLoginProcessing(false);
        }
    };

    // 未ログインの場合は認証UIを表示
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white dark:bg-background rounded-2xl shadow-xl p-8 space-y-6">
                    {/* ロゴ・タイトルエリア */}
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600  rounded-xl mx-auto flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">こんにちは！</h1>
                        <p className="text-gray-600">
                            サインインして始めましょう
                        </p>
                    </div>

                    {/* Googleサインインボタン */}
                    <div className="space-y-4">
                        <Button 
                            onClick={handleGoogleSignIn}
                            disabled={isLoginProcessing}
                            className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex gap-3 h-12"
                        >
                            {isLoginProcessing ? (
                                // ローディング中のスピナー
                                <LoadingSpinner className="h-5 w-5" />
                            ) : (
                                // Googleアイコン
                                <GoogleIcon className="h-5 w-5" />
                            )}
                            <span>
                                {isLoginProcessing ? '接続中．．．' : 'Googleでサインイン'}
                            </span>
                        </Button>
                        
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">
                                    または
                                </span>
                            </div>
                        </div>

                        {/* 認証方法追加用プレースホルダー */}
                        <div className="text-center text-sm text-gray-500">
                            他のサインイン方法は近日追加予定
                        </div>

                        {/* フッター */}
                        <div className="text-center text-xs text-gray-500 pt-4">
                            <p>
                                サインインすることで、
                                <a href="#" className="text-blue-600 hover:underline mx-1">
                                    利用規約
                                </a>
                                と
                                <a href="#" className="text-blue-600 hover:underline mx-1">
                                    プライバシーポリシー
                                </a>
                                に同意したことになります。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
