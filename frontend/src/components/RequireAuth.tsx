// ログインしていないユーザーをログインページにリダイレクトさせるコンポーネント
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthSession } from '../hooks/useAuthSession';

interface RequireAuthProps {
    children?: React.ReactNode;
}

// 認証必須のルート
export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuthSession();

    if (loading) {
        // 認証チェック中
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        // ログインしていない場合
        return <Navigate to="/login" replace />;
    }

    // ログインしている場合
    return children ? <>{children}</> : <Outlet />;
};
