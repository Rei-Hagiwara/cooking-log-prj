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
            <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-blue-50 to-indigo-100">
                <p className="text-gray-600">認証状態を確認中．．．</p>
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
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white dark:bg-background rounded-2xl shadow-xl p-8 space-y-6">
                    {/* ロゴ・タイトルエリア */}
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl mx-auto flex items-center justify-center">
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
