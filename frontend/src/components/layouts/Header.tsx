import React, { useState, useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../../lib/supabase';

type HeaderProps = {
    onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement>(null);   // 

    // ログアウト処理
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error);
            alert('ログアウトに失敗しました');
        }
    };

    useEffect(() => {
        // ユーザーメニュー外クリック時に閉じる処理
        const handleClickOutside = (event: MouseEvent) => {
            // メニュー外側がクリックされた場合
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="
            sticky top-0 z-40 w-full h-16 
            border-b border-border 
            px-4 
            bg-card
            flex items-center justify-between">
            <div className="flex items-center gap-4">
                {/* ハンバーガーアイコン */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-muted rounded-md cursor-pointer"
                >
                    <span className="text-2xl">☰</span>
                </button>
                {/* タイトル（タブレット以下でのみ表示） */}
                <span className="lg:hidden font-bold text-lg text-primary">Cooking-log</span>
            </div>

            {/* ユーザーメニューエリア */}
            <div className="relative" ref={menuRef}>
                {/* ユーザーアイコン */}
                <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2 hover:bg-muted rounded-full cursor-pointer transition-colors">
                    <span className="text-xl">👤</span>
                </button>
                {/* ドロップダウンメニュー */}
                <div className={`
                    absolute right-0 mt-2 w-48
                    rounded-md border border-border bg-card shadow-lg py-1 z-50 
                    origin-top-right transition-all duration-200 ease-in-out cursor-pointer
                    ${isUserMenuOpen
                        ? "opacity-100 translate-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"}
                `}>
                    <button
                        onClick={() => {
                            navigate('/');
                            setIsUserMenuOpen(false);
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm hover:bg-muted cursor-pointer transition-colors"
                    >
                        <span className="mr-2">👤</span> マイページ
                    </button>
                    <button
                        onClick={() => {
                            handleLogout();
                            setIsUserMenuOpen(false);
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-destructive-foreground hover:bg-muted cursor-pointer transition-colors"
                    >
                        <span className="mr-2">🚪</span> ログアウト
                    </button>
                </div>
            </div>
        </header>
    );
};
