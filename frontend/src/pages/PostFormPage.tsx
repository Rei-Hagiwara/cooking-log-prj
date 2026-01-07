import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { validateText } from '../utils/validators';
import { Layout } from '../components/layouts/Layout';
import { StepPhase } from '../components/post-form/StepPhase';
import { FinalPhase } from '../components/post-form/FinalPhase';
import { ReviewPhase } from '../components/post-form/ReviewPhase';
import type { CookingStep, FinalResult } from '../types/post-form';

// ログ投稿ページ
export const PostFormPage: React.FC = () => {
    const navigate = useNavigate();
    
    // --- State ---
    const [phase, setPhase]                         = useState<'steps' | 'final' | 'review'>('steps');  // 投稿フェーズ
    const [isSubmitting, setIsSubmitting]           = useState(false);                                  // 送信中フラグ
    const [direction, setDirection]                 = useState<'forward' | 'back'>('forward');          // スライドアニメーションの方向
    const [areStepsSkipped, setAreStepsSkipped]     = useState(false);                                  // 手順入力をスキップしたかフラグ
    const [currentStepIndex, setCurrentStepIndex]   = useState(0);                                      // 現在の調理手順インデックス番号
    const [steps, setSteps]                         = useState<CookingStep[]>([{                        // 調理手順 
        id: 1, 
        image: null, 
        previewUrl: null, 
        description: '', 
        error: null 
    }]);
    const [finalData, setFinalData]                 = useState<FinalResult>({                           // 完成品
        image: null, 
        previewUrl: null, 
        rating: 3, 
        comment: '', 
        error: null 
    });

    // --- 現在の状態判定ロジック ---
    const currentStep   = steps[currentStepIndex];
    // 写真かコメントがあれば入力済み
    const hasContent    = !!currentStep.image || currentStep.description.trim().length > 0;

    // 現在のStepのエラーフラグ
    const hasCurrentStepError = !!steps[currentStepIndex].error;
    // 完成品のエラーフラグ
    const hasFinalError = !!finalData.error;

    // --- ハンドラー ---
    // 1. 画像処理
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, isFinal: boolean) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        const url  = URL.createObjectURL(file);

        // 完成品か
        if (isFinal) {
            setFinalData(prev => ({ ...prev, image: file, previewUrl: url }));
        } else {
            setSteps(prev => {
                const newSteps = [...prev];
                newSteps[currentStepIndex] = { ...newSteps[currentStepIndex], image: file, previewUrl: url };
                return newSteps;
            });
        }
    };

    // 2．コメント処理（調理手順）
    const handleTextChange = (text: string) => {
        // バリデーション実行
        const error = validateText(text);

        setSteps(prev => {
            const newSteps = [...prev];
            newSteps[currentStepIndex] = {
                ...newSteps[currentStepIndex],
                description: text,
                error: error,
            };
            return newSteps;
        });
    };

    // 3．コメント処理（完成品）
    const handleFinalCommentChange = (text: string) => {
        // バリデーション実行
        const error = validateText(text);

        setFinalData(prev => ({
            ...prev,
            comment: text,
            error: error,
        }));
    };

    // 4. [進む]アクション
    const goForward = (targetPhase?: 'final' | 'review') => {
        setDirection('forward');

        if (targetPhase) {
            setPhase(targetPhase);
        } else {
            // Stepを進める
            const nextIndex = currentStepIndex + 1;
            if (nextIndex >= steps.length) {
                setSteps([
                    ...steps,
                    {
                        id: nextIndex + 1,
                        image: null,
                        previewUrl: null,
                        description: ''
                    }
                ]);
            }
            setCurrentStepIndex(nextIndex);
        }
    };

    // 5．[戻る]アクション
    const goBack = () => {
        setDirection('back');

        if (phase === 'review') {
            setPhase('final');
        } else if (phase === 'final') {
            // 最終確認から戻るときのみスキップフラグを戻しておく
            setAreStepsSkipped(false);
            setPhase('steps');
        } else if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    // 6．[スキップ]アクション
    const handleSkipSteps = () => {
        setAreStepsSkipped(true);

        // Stepデータをクリアして最終確認へ
        setSteps([{
            id: 1,
            image: null,
            previewUrl: null,
            description: ''
        }]);
        goForward('final');
    };

    // 7. 送信処理
    const handleSubmit = async () => {
        if (isSubmitting || !finalData.image) return;
        setIsSubmitting(true);

        try {
            const user = await supabase.auth.getUser();
            const userId = user.data.user?.id;
            if (!userId) throw new Error("ユーザー認証エラー");

            // 画像アップロード
            const fileExt = finalData.image.name.split('.').pop();
            const fileName = `main-${Date.now()}.${fileExt}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('images').upload(`${userId}/${fileName}`, finalData.image);

            if (uploadError) throw uploadError;

            const { data: publicUrl } = supabase.storage.from('images').getPublicUrl(uploadData.path);

            // コメント結合
            let fullComment = finalData.comment;
            // スキップされていない場合のみ手順コメントを追加
            if (!areStepsSkipped) {
                const stepTexts = steps
                    .filter(s => s.description || s.image)
                    .map((step, i) => `[手順${i + 1}] ${step.description}`);

                if (stepTexts.length > 0) {
                    fullComment += "\n\n--- 調理ログ ---\n" + stepTexts.join("\n");
                }
            }

            // DB保存
            const { error: dbError } = await supabase.from('posts').insert([{
                user_id: userId,
                image_url: publicUrl.publicUrl,
                comment: fullComment,
                rating: finalData.rating,
            }]);

            if (dbError) throw dbError;
            alert ("記録完了!");
            navigate('/');
        } catch (err: any) {
            alert(err.message);
            setIsSubmitting(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="relative z-10 max-w-2xl mx-auto mt-6 lg:mt-12 mb-10">
                <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">

                    {/* ヘッダー（進捗） */}
                    <div className="bg-muted/50 px-6 py-4 border-b border-border flex justify-between items-center">
                        <span className="font-bold text-primary">
                            {phase === 'steps' ? `手順 ${currentStepIndex + 1}` : phase === 'final' ? '完成' : '最終確認'}
                        </span>
                        {/* 進捗ドット（スキップ時は一つのみ） */}
                        <div className="flex gap-1">
                            {!areStepsSkipped && steps.map((_, i) => (
                                <div key={i} className={`w-2 h-2 rounded-full ${i === currentStepIndex && phase === 'steps' ? 'bg-primary' : 'bg-gray-300'}`} />
                            ))}
                            <div className={`w-2 h-2 rounded-full ${phase !== 'steps' ? 'bg-primary' : 'bg-gray-300'}`} />
                        </div>
                    </div>

                    {/* ボディ（コンテンツ切り替え） */}
                    <div className="p-6 min-h-100 flex flex-col overflow-hidden relative">
                        {/* keyにphaseとcurrentStepIndexを指定することで、Reactの再描画を発火 */}
                        <div 
                            key={`${phase}-${currentStepIndex}`}
                            className={`${direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}
                        >
                            {phase === 'steps' && (
                                <StepPhase
                                    stepData={steps[currentStepIndex]}
                                    onImageChange={(e) => handleImageSelect(e, false)}
                                    onTextChange={handleTextChange}
                                    error={steps[currentStepIndex].error}
                                />
                            )}
                            {phase === 'final' && (
                                <FinalPhase
                                    data={finalData}
                                    onImageChange={(e) => handleImageSelect(e, true)}
                                    onUpdate={(updates) => {
                                        if (updates.comment !== undefined) {
                                            handleFinalCommentChange(updates.comment);
                                        } else {
                                            setFinalData({
                                                ...finalData,
                                                ...updates
                                            });
                                        }
                                    }}
                                    error={finalData.error ?? null}
                                />
                            )}
                            {phase === 'review' && (
                                <ReviewPhase
                                    steps={areStepsSkipped ? [] : steps}    // スキップ時はStepは空を渡す
                                    finalData={finalData}
                                    isSkipped={areStepsSkipped}
                                />
                            )}
                        </div>
                    </div>

                    {/* 3. フッター（ナビゲーションボタン） */}
                    <div className="bg-muted/50 px-6 py-4 bordet-t border-border flex justify-between">
                        {/* 戻るボタン */}
                        {phase === 'steps' && currentStepIndex === 0 ? (
                            <button onClick={() => navigate('/')} className="text-sm text-muted-foreground transition ease-in duration-150 hover:text-foreground cursor-pointer">キャンセル</button>
                        ) : (
                            <button onClick={goBack} className="px-4 py-2 rounded-lg transition ease-in duration-150 hover:bg-muted text-sm cursor-pointer">戻る</button>
                        )}

                        {/* 進むボタン */}
                        {phase === 'steps' ? (
                            <div className="flex gap-2">
                                {/* Step 1が空なら「スキップ」ボタン、入力済みなら「完成」ボタン */}
                                {currentStepIndex === 0 && !hasContent ? (
                                    <button
                                        onClick={handleSkipSteps}
                                        disabled={hasCurrentStepError}
                                        className={`
                                            px-4 py-2 text-sm font-bold text-muted-foreground
                                            ${hasCurrentStepError 
                                                ? 'text-muted-foreground/80'
                                                : 'text-muted-foreground hover:text-primary cursor-pointer transition ease-in duration-150'
                                            }
                                        `}
                                    >
                                        手順をスキップする
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => setPhase('final')} 
                                        disabled={hasCurrentStepError}
                                        className={`
                                            px-4 py-2 text-sm font-bold
                                            ${hasCurrentStepError 
                                                ? 'text-muted-foreground/80'
                                                : 'text-muted-foreground hover:bg-primary/10 cursor-pointer rounded-lg transition ease-in duration-150'
                                            }
                                        `}
                                    >
                                        完成!
                                    </button>
                                )}

                                {/* 「次へ」ボタン（入力必須） */}
                                <button 
                                    onClick={() => goForward()} 
                                    disabled={!hasContent || hasCurrentStepError}
                                    className={`
                                        px-6 py-2 bg-primary rounded-lg font-bold
                                        ${!hasContent || hasCurrentStepError 
                                            ? 'text-white/80' 
                                            : 'text-white hover:bg-primary/90 hover:scale-105 cursor-pointer transition-transform'
                                        }
                                    `}
                                >
                                    次へ
                                </button>
                            </div>
                        ) : phase === 'final' ? (
                            <button 
                                onClick={() => setPhase('review')} 
                                disabled={!finalData.image || hasFinalError} 
                                className={`
                                    px-6 py-2 bg-primary text-white rounded-lg shadow-lg disabled:opacity-50
                                    ${!finalData.image || hasFinalError 
                                        ? 'hover:bg-primary/90 hover:scale-105 cursor-pointer transition-transform' 
                                        : ''
                                    }
                                `}
                            >
                                確認画面へ
                            </button>
                        ) : (
                            <button 
                                onClick={handleSubmit} 
                                disabled={isSubmitting || hasFinalError} 
                                className={`
                                    px-8 py-2 bg-primary text-white font-bold rounded-lg shadow-xl 
                                    ${isSubmitting 
                                        ? 'animate-pulse' 
                                        : ''
                                    }
                                    ${isSubmitting || hasFinalError 
                                        ? 'hover:bg-primary/90 hover:scale-105 cursor-pointer transition-transform' 
                                        : ''
                                    }
                                `}
                            >
                                {isSubmitting ? '保存中．．．' : 'ログを保存'}
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </Layout>
    );
};
