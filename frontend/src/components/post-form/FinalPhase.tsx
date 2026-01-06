import React from 'react';
import type { FinalResult } from '../../types/post-form';

type Props = {
    data: FinalResult;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUpdate: (data: Partial<FinalResult>) => void;
};

export const FinalPhase = ({ data, onImageChange, onUpdate }: Props) => {
    return (
        <div className="flex-1 flex flex-col gap-4 slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold">完成！！</h2>
            <p className="text-sm text-muted-foreground">最高の出来栄えを記録しよう</p>

            {/* 画像アップロード */}
            <label className="flex-1 border-2 border-dashed border-primary/50 bg-primary/5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors relative overflow-hidden min-h-50">
                <input type="file" className="hidden" accept="image/*" onChange={onImageChange} />
                {data.previewUrl ? (
                    <img src={data.previewUrl} alt="final" className="w-full h-full object-cover" />
                ): (
                    <div className="text-center p-4">
                        <span className="text-5xl block mb-2">★</span>
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

            <textarea
                className="w-full p-3 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                placeholder="全体の感想、コツ、次回へのメモ．．．"
                rows={3}
                value={data.comment}
                onChange={(e) => onUpdate({ comment: e.target.value })}
            />
        </div>
    );
};
