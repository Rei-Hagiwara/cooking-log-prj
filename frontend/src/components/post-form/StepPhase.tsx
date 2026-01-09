import React from 'react';
import type { CookingStep } from '../../types/post-form';

type Props = {
    stepIndex: number;
    stepData: CookingStep;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onTextChange: (text: string) => void;
    commentError?: string | null;
    imageError?: string | null;
};

/**
 * 投稿カードフォーム（調理手順）
 * @param stepIndex     調理手順番号
 * @param stepData      手順データ
 * @param onImageChange 画像変更時処理
 * @param onTextChange  テキスト変更時処理
 * @param commentError  コメントのバリデーションエラー
 * @param imageError    画像のバリデーションエラー
 */ 
export const StepPhase = ({ stepIndex, stepData, onImageChange, onTextChange, commentError, imageError }: Props) => {
    return (
        <div className="flex flex-1 flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <h2 className="text-xl font-bold">調理のようす</h2>
            </div>

            {/* 画像アップロード */}
            <div className="flex flex-1 flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <label className={`
                    w-full aspect-4/3 border-2 border-dashed border-border rounded-lg 
                    flex items-center justify-center 
                    cursor-pointer hover:bg-muted/50 transition-colors 
                    relative group overflow-hidden bg-muted/20
                    ${imageError ? 'border-red-500 bg-red-50' : 'border-border'}
                `}>
                    <input type="file" className="hidden" accept="image/*" onChange={onImageChange} />
                    {stepData.previewUrl ? (
                        <img 
                            src={stepData.previewUrl} 
                            alt="preview" 
                            className="w-full h-full object-cover object-center" 
                        />
                    ) : (
                        <div className="text-center p-4">
                            <span className="text-4xl block mb-2">📷</span>
                            <span className="text-sm text-muted-foreground">写真を撮る / 選択</span>
                        </div>
                    )}
                </label>
                {/* エラーメッセージ */}
                {imageError && (
                    <p className="text-xs text-red-500 mt-1 font-bold animate-pulse">
                        {imageError}
                    </p>
                )}
            </div>

            {/* テキストエリア */}
            <div className="w-full">
                <textarea
                    className={`
                        w-full p-3 
                        text-sm
                        bg-background border 
                        rounded-md 
                        focus:ring-2
                        outline-none resize-none
                        ${commentError
                            ? 'border-red-500 focus:ring-red-500/50 bg-red-50 dark:bg-red-900/10'
                            : 'border-border focus:ring-primary'
                        }
                    `}
                    placeholder="野菜を切る、炒める、盛り付ける．．．"
                    rows={5}
                    value={stepData.description}
                    onChange={(e) => onTextChange(e.target.value)}
                />
                {/* エラーメッセージ */}
                {commentError && (
                    <p className="text-xs text-red-500 mt-1 font-bold animate-pulse">
                        {commentError}
                    </p>
                )}
                {/* 文字数カウンター */}
                <div className="text-right text-xs text-muted-foreground mt-1">
                    {stepData.description.length} / 200
                </div>
            </div>
        </div>
    );
};
