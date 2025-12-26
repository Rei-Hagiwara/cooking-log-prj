import React from "react";
import { useNavigate } from 'react-router-dom';
import { SidebarContent } from "./Sidebar";

type MobileSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const MobileDrawer = ({ isOpen, onClose }: MobileSidebarProps) => {
    return (
        <div className="lg:hidden">
            {/* オーバーレイ */}
            <div
                className={`
                    fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 
                    ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                `}
                onClick={onClose}
            />

            {/* サイドメニュー本体 */}
            <div
                className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border shadow-xl transform transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    `}
            >
                <div className="h-full flex flex-col relative">
                    <SidebarContent onItemClick={onClose} />

                    {/* 閉じるボタン */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-muted cursor-pointer rounded-full"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
};
