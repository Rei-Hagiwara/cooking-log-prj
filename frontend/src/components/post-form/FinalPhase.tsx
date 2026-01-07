import React from 'react';
import type { FinalResult } from '../../types/post-form';

type Props = {
    data: FinalResult;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUpdate: (data: Partial<FinalResult>) => void;
    error: string | null;
};

/**
 * 投稿カードフォーム（完成品）
 * @param data          完成品データ
 * @param onImageChange 画像変更時処理
 * @param onUpdate      満足度・テキスト変更時処理
 * @param error         バリデーションエラー
 */ 
export const FinalPhase = ({ data, onImageChange, onUpdate, error }: Props) => {
    return (
        <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-xl font-bold">完成！！</h2>
            <p className="text-sm text-muted-foreground">最高の出来栄えを記録しよう</p>

            {/* 画像アップロード */}
            <label className="
                w-full aspect-4/3 
                border-2 border-dashed border-primary/50 bg-primary/5 rounded-lg 
                flex items-center justify-center 
                cursor-pointer hover:bg-primary/10 transition-colors 
                relative 
                overflow-hidden
            ">
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

            {/* 満足度（Star Rating） */}
            <div className="flex items-center justify-center gap-2 py-2">
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
                        ${error
                            ? 'border-red-500 focus:ring-red-500/50 bg-red-50 dark:bg-red-900/10'
                            : 'border-border focus:ring-primary'
                        }
                    `}
                    placeholder="全体の感想、コツ、次回へのメモ．．．"
                    rows={5}
                    value={data.comment}
                    onChange={(e) => onUpdate({ comment: e.target.value })}
                />
                {error && (
                    <p className="text-xs text-red-500 mt-1 font-bold">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};
