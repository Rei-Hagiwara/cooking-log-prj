import React, { useState } from 'react';
import type { DishFormData } from '../../types/post-form';

type Props = {
    dish: DishFormData;
    index: number;
    onEdit: () => void;
    onDelete: () => void;
};

/**
 * 完成済みの料理リスト
 * @param dish      料理データ
 * @param index     リスト内の番号
 * @param onEdit    編集処理
 * @param onDelete  削除処理
 */
export const DishListItem = ({ dish, index, onEdit, onDelete }: Props) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);            // 手順の開閉フラグ
    const [showMobileMenu, setShowMobileMenu] = useState(false);    // モバイル用メニュー開閉フラグ

    // カード全体クリック時の処理（モバイル用メニュー表示）
    const handleCardClick = () => {
        // PCサイズ以上ならスルー
        if (window.innerWidth >= 768) return;
        setShowMobileMenu(true);
    };

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md relative">

            {/* --- メイン情報エリア（完成品） --- */}
            <div 
                className="p-4 flex gap-4 cursor-pointer relative"
                onClick={handleCardClick}
            >
                {/* 左：完成写真 */}
                <div className="w-24 h-2/4 md:w-32 md:h-32 shrink-0 bg-muted rounded-lg overflow-hidden border border-border">
                    {dish.previewUrl ? (
                        <img src={dish.previewUrl} alt={dish.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">画像無し</div>
                    )}
                </div>

                {/* 右：情報 */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg leading-tight truncate pr-8">{dish.name}</h3>
                            {/* PC: 編集・削除ボタン */}
                            <div className="hidden md:flex gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onEdit() }}
                                    className="text-xs px-2 py-1 bg-background border rounded hover:bg-muted transition-colors"
                                >
                                    編集
                                </button>
                                <button
                                    onClick={() => { onDelete(); setIsMenuOpen(false); }}
                                    className="text-xs px-2 py-1 text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    削除
                                </button>
                            </div>
                        </div>
                        <div className="text-yellow-400 text-sm mt-1">{'★'.repeat(dish.rating)}</div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 md:line-clamp-3">
                            {dish.comment || <span className="italic opacity-50">コメントなし</span>}
                        </p>
                    </div>

                    {/* トグルボタン */}
                    <div className="flex justify-between items-end mt-2">
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                            {index + 1}品目
                        </span>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();    // モバイル用メニュー表示を阻止
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            className="p-1 hover:bg-muted rounded-full transition-colors"
                        >
                            {/* アイコン */}
                            <svg 
                                className={`w-6 h-6 text-muted-foreground transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* モバイル用オーバーレイメニュー */}
                {showMobileMenu && (
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center gap-6 animate-in fade-in duration-200 md:hidden"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMobileMenu(false);
                        }}
                    >
                        <button
                            onClick={() => onEdit()}
                            className="bg-white text-foreground font-bold px-6 py-3 rounded-full shadow-lg active:scale-95 transition-transform"
                        >
                            編集
                        </button>
                        <button
                            onClick={() => onDelete()}
                            className="bg-red-500 text-white font-bold px-6 py-3 rounded-full shadow-lg active:scale-95 transition-transform"
                        >
                            削除
                        </button>
                    </div>
                )}
            </div>

            {/* --- 手順エリア --- */}
            {isMenuOpen && (
                <div className="border-t border-border bg-muted/30 p-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex gap-4 flex-col md:flex-row md:overflow-x-auto md:pb-2 md:snap-x">
                        {dish.isSkipped ? (
                            <div className="text-center w-full py-4 text-muted-foreground">
                                スキップされました
                            </div>
                        ) : dish.steps.map((step, i) => (
                            <div
                                key={i}
                                className="
                                    bg-background border border-border rounded-lg p-3 shrink-0 md:snap-start
                                    flex gap-3 flex-row md:flex-col md:w-48
                                "
                            >
                                {/* 手順番号 */}
                                <div className="md:hidden font-bold text-xs text-muted-foreground min-2-5">
                                    {i + 1}
                                </div>

                                {/* 手順写真 */}
                                <div className="
                                    bg-muted rounded overflow-hidden shrink-0 border border-boder
                                    w-20 h-20 md:w-full md:aspect-4/3 md-h-auto
                                ">
                                    {step.previewUrl ? (
                                        <img src={step.previewUrl} className="w-full h-full object-cover" alt={`Step ${i+1}`} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">画像無し</div>
                                    )}
                                </div>

                                {/* 手順コメント */}
                                <div className="flex-1 min-w-0 flex flex-col">
                                    <span className="hidden md:block text-xs font-bold text-muted-foreground mb-1">Step {i+1}</span>
                                    <p className="text-sm text-foreground leading-relaxed md:line-clamp-4">
                                        {step.description || <span className="text-muted-foreground italic text-xs">説明なし</span>}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
