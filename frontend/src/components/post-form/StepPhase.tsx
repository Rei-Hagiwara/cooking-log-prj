import React from 'react';
import type { CookingStep } from '../../types/post-form';

type Props = {
    stepData: CookingStep;                                              // 各手順データ
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;    // 画像変更時の処理
    onTextChange: (text: string) => void;                               // コメント変更時の処理
    error?: string | null;                                              // バリデーションエラー
};

/**
 * 投稿カードフォーム（調理手順）
 * @param stepData      手順データ
 * @param onImageChange 画像変更時処理
 * @param onTextChange  テキスト変更時処理
 * @param error         バリデーションエラー
 */ 
export const StepPhase = ({ stepData, onImageChange, onTextChange, error }: Props) => {
    return (
        <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-xl font-bold">調理手順</h2>
            <p className="text-sm text-muted-foreground">調理のようす</p>

            {/* 画像アップロード */}
            <label className="
                w-full aspect-4/3 border-2 border-dashed border-border rounded-lg 
                flex items-center justify-center 
                cursor-pointer hover:bg-muted/50 transition-colors 
                relative group 
                overflow-hidden 
                bg-muted/20
            ">
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
                        ${error
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
                {error && (
                    <p className="text-xs text-red-500 mt-1 font-bold animate-pulse">
                        {error}
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
