import React from 'react';
import type { CookingStep, FinalResult } from '../../types/post-form';

type Props = {
    steps: CookingStep[];
    finalData: FinalResult;
    isSkipped: boolean;
};

export const ReviewPhase = ({ steps, finalData, isSkipped }: Props) => {
    return (
        <div className="flex-1 flex flex-col gap-4 pr-2">
            <h2 className="text-xl font-bold text-center border-b border-border pb-2">ログの確認</h2>

            {/* 完成品のプレビュー */}
            <div className="bg-muted/30 p-4 rounded-lg flex flex-col gap-4">
                    {finalData.previewUrl && (
                        <div className="w-full aspect-4/3 rounded-md overflow-hidden bg-background border border-border">
                            <img 
                                src={finalData.previewUrl} 
                                className="w-full h-full object-cover object-center" 
                                alt="Final" 
                            />
                        </div>
                    )}
                    <div>
                        <div className="text-yellow-500 text-lg">
                            {'★'.repeat(finalData.rating)}
                        </div>
                        <p className="text-sm mt-1 whitespace-pre-wrap">
                            {finalData.comment}
                        </p>
                    </div>
            </div>

            {/* 手順のタイムライン */}
            <div className="pl-2">
                <h3 className="text-sm font-bold text-muted-foreground mb-3">
                    調理手順
                </h3>

                {isSkipped ? (
                    // 手順スキップ時
                    <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-boder">
                        <span className="text-2xl block mb-2">⏩</span>
                        <p className="text-sm">手順の記録はスキップされました</p>
                    </div>
                ) : (
                    // 通常
                    <div className="space-y-6">
                        {steps.map((step, i) => (step.image || step.description) && (
                            <div key={i} className="flex flex-col gap-3 relative pb-4">
                                {/* 縦線 */}
                                {i !== steps.length - 1 && <div className="absolute left-3.75 top-8 bottom-2.5 w-0.5 bg-border" />}

                                {/* 番号 */}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 text-sm font-bold z-10">
                                        {i + 1}
                                    </div>
                                </div>

                                <div className="pl-11 flex flex-col md:flex-row items-start gap-4">
                                    {/* 写真 */}
                                    <div className="w-full md:w-1/2 aspect-4/3 rounded-md overflow-hidden border border-border bg-muted shrink-0">
                                        {step.previewUrl ? (
                                            <img 
                                                src={step.previewUrl} 
                                                className="w-full h-full object-cover object-center" 
                                                alt={`Step ${i+1}`} 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/50">
                                                <span className="text-xs">写真なし</span>
                                            </div>
                                        )}
                                    </div>
                                    {/* コメント */}
                                    <div className="flex-1 py-1">
                                        <p className="text-base text-foreground whitespace-pre-wrap leading-relaxed">
                                            {step.description || <span className="text-muted-foreground italic text-sm">コメントなし</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
