import React from 'react';
import type { DishFormData } from '../../types/post-form';

type Props = {
    data: DishFormData;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUpdate: (data: Partial<DishFormData>) => void;
    commentError?: string | null;
    nameError?: string | null;
    imageError?: string | null;
};

/**
 * 投稿カードフォーム（完成品）
 * @param data          完成品データ
 * @param onImageChange 画像変更時処理
 * @param onUpdate      満足度・テキスト変更時処理
 * @param commentError  コメントのバリデーションエラー
 * @param nameError     投稿タイトルのバリデーションエラー
 * @param imageError    画像のバリデーションエラー
 */ 
export const FinalPhase = ({ data, onImageChange, onUpdate, commentError, nameError, imageError }: Props) => {
    return (
        <div className="flex-1 flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* タイトル */}
            <div>
                <div className="border-b-2 border-primary/20 focus-within:border-primary transition-colors">
                    <label className="block text-xs font-bold text-primary mb-1">
                        料理名 <span className="text-red-500">＊</span>
                    </label>
                    <input
                        type="text"
                        className={`
                            w-full py-2 text-xl font-bold bg-transparent outline-none placeholder:text-muted-foreground/40
                            ${nameError
                                ? 'border-red-500 focus:ring-red-500/50 bg-red-50 dark:bg-red-900/10'
                                : 'border-border focus:ring-primary'
                            }
                        `}
                        placeholder="カレーライス．．．"
                        value={data.name}
                        onChange={(e) => onUpdate({ name: e.target.value })}
                        autoFocus
                    />
                </div>
                {/* バリデーションエラー */}
                {nameError && (
                    <p className="text-xs text-red-500 mt-1 font-bold">{nameError}</p>
                )}
            </div>

            {/* 完成写真 */}
            <div>
                <label className={`
                    w-full aspect-4/3 border-2 border-dashed border-primary/50 bg-primary/5 rounded-lg 
                    flex items-center justify-center 
                    cursor-pointer hover:bg-primary/10 transition-colors 
                    relative overflow-hidden
                    ${imageError ? 'border-red-500 bg-red-50' : 'border-primary/50 bg-primary/5'}
                `}>
                    <input type="file" className="hidden" accept="image/*" onChange={onImageChange} />
                    {data.previewUrl ? (
                        <img 
                            src={data.previewUrl} 
                            alt="final" 
                            className="w-full h-full object-cover object-center" 
                        />
                    ): (
                        <div className="text-center p-4">
                            <span className="text-5xl block mb-2">✨</span>
                            <span className="text-sm font-bold text-ptimary">完成写真をアップロード</span>
                        </div>
                    )}
                </label>
                {/* バリデーションエラー */}
                {imageError && (
                    <p className="text-xs text-red-500 mt-1 font-bold">{imageError}</p>
                )}
            </div>

            {/* 満足度とコメント */}
            <div className="space-y-3">
                {/* 満足度（星評価） */}
                <div className="flex items-center justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => onUpdate({ rating: star })}
                            className={`text-3xl transition-transform hover:scale-110 ${star <= data.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                            ★
                        </button>
                    ))}
                </div>

                {/* コメント */}
                <div className="w-full">
                    <textarea
                        className={`
                            w-full p-3 rounded-md 
                            text-sm 
                            bg-background border 
                            focus:ring-2 
                            outline-none resize-none
                            ${commentError
                                ? 'border-red-500 focus:ring-red-500/50 bg-red-50 dark:bg-red-900/10'
                                : 'border-border focus:ring-primary'
                            }
                        `}
                        placeholder="調理の感想、反省点、次回へのメモ．．．"
                        rows={5}
                        value={data.comment}
                        onChange={(e) => {
                            const text = e.target.value;
                            onUpdate({ comment: text })}
                        }
                    />
                    {commentError && (
                        <p className="text-xs text-red-500 mt-1 font-bold">
                            {commentError}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
