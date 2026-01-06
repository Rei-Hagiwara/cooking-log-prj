import React from 'react';
import type { CookingStep, FinalResult } from '../../types/post-form';

type Props = {
    steps: CookingStep[];
    finalData: FinalResult;
};

export const ReviewPhase = ({ steps, finalData }: Props) => {
    return (
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-125 pr-2">
            <h2 className="text-xl font-bold text-center border-b border-border pb-2">ログの確認</h2>

            {/* 完成品 */}
            <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex gap-4">
                    {finalData.previewUrl && <img src={finalData.previewUrl} className="w-20 h-20 object-cover rounded-md" alt="Final" />}
                    <div>
                        <div className="text-yellow-500">{'★'.repeat(finalData.rating)}</div>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{finalData.comment}</p>
                    </div>
                </div>
            </div>

            {/* 手順のタイムライン */}
            <div className="space-y-4 pl-2">
                {steps.map((step, i) => (step.image || step.description) && (
                    <div key={i} className="flex gap-4 relative">
                        {/* 縦線 */}
                        {i !== steps.length - 1 && <div className="absolute left-3.75 top-8 bottom-4 w-0.5 bg-border" />}

                        {/* 番号 */}
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 text-sm font-bold z-10">
                            {i + 1}
                        </div>

                        <div className="flex-1 pb-4">
                            {step.previewUrl && (
                                <img src={step.previewUrl} className="w-full h-32 object-cover rounded-md mb-2" alt={`Step ${i+1}`} />
                            )}
                            <p className="text-sm text-foreground whitespace-pre-wrap">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
