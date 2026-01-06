import React from 'react';
import type { CookingStep } from '../../types/post-form';

type Props = {
    stepIndex: number;
    stepData: CookingStep;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onTextChange: (text: string) => void;
};

export const StepPhase = ({ stepIndex, stepData, onImageChange, onTextChange }: Props) => {
    return (
        <div className="flex-1 flex flex-col gap-4 duration-300">
            <h2 className="text-xl font-bold">料理手順</h2>
            <p className="text-sm text-muted-foreground">手順 {stepIndex + 1} のようす</p>

            {/* 画像アップロード */}
            <label className="flex-1 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors relative group overflow-hidden bg-muted/20 min-h-50">
                <input type="file" className="hidden" accept="image/*" onChange={onImageChange} />
                {stepData.previewUrl ? (
                    <img src={stepData.previewUrl} alt="preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-center p-4">
                        <span className="text-4xl block mb-2">📷</span>
                        <span className="text-sm text-muted-foreground">写真を撮る / 選択</span>
                    </div>
                )}
            </label>

            {/* テキストエリア */}
            <textarea
                className="w-full p-3 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none resize-none"
                placeholder="野菜を切る、炒める、盛り付ける．．．"
                rows={3}
                value={stepData.description}
                onChange={(e) => onTextChange(e.target.value)}
            />
        </div>
    );
};
