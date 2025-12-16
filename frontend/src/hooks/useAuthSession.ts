import { useState, useEffect } from "react";
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

/**
 * 認証状態（セッション）を管理するフック
 * @returns session: セッション
 * @returns isAuthenticated: 認証済みかフラグ
 * @returns loading: 認証中かフラグ
 */
export function useAuthSession() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    // 初回ロード時の挙動
    useEffect(() => {
        // ログイン状態を問い合わせて、現在のセッションを取得 & 認証中かフラグをオフ
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // 認証状態の変化を監視し、セッションを更新
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {  // サインイン/アウトなどのイベント名（使用しない）、セッション
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
