import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Header } from './Header';
import { DesktopSidebar, MobileDrawer } from './Sidebar';

type LayoutProps = {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    // サイドメニューの開閉状態
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground flex">

            {/* サイドバー（PCサイズ） */}
            <DesktopSidebar />

            {/* モバイル用サイドメニュー */}
            <MobileDrawer
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* メインコンテンツエリア */}
            <div className="flex-1 flex flex-col relative w-full">

                {/* ヘッダー */}
                <Header onMenuClick={() => setIsSidebarOpen(true)} />

                {/* コンテンツ部分 */}
                <main className="p-4 lg:p-8 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
};
