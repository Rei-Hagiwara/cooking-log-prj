import { useState, useEffect } from "react";
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

// 認証状態（セッション）を管理するフック
export function useAuthSession() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 最初のロード時に現在のセッションを取得
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // 認証状態の変化を監視し、セッションを更新
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );

        // クリーンアップ
        return () => subscription.unsubscribe();
    }, []);

    // ログイン済みかどうかを真偽値で返す
    const isAuthenticated   = !!session;

    return { session, isAuthenticated, loading };
}
