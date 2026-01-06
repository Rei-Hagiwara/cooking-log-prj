import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
// import type { PostInsert } from '../types/Post';
import { Layout } from '../components/layouts/Layout';
import { StepPhase } from '../components/post-form/StepPhase';
import { FinalPhase } from '../components/post-form/FinalPhase';
import { ReviewPhase } from '../components/post-form/ReviewPhase';
import type { CookingStep, FinalResult } from '../types/post-form';

// ログ投稿ページ
export const PostFormPage: React.FC = () => {
    const navigate = useNavigate();
    // --- State ---
    const [phase, setPhase] = useState<'steps' | 'final' | 'review'>('steps');  // 投稿フェーズ
    const [isSubmitting, setIsSubmitting] = useState(false);                    // 送信中フラグ
    const [steps, setSteps] = useState<CookingStep[]>([                         // 各調理手順
        { id: 1, image: null, previewUrl: null, description: '' }
    ]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);                // 現在の調理手順番号
    const [finalData, setFinalData] = useState<FinalResult>({                   // 完成品
        image: null, previewUrl: null, rating: 3, comment: ''
    });

    // --- ハンドラー ---
    // 1. 画像処理
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, isFinal: boolean) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        const url  = URL.createObjectURL(file);

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

    // 2. 手順を進める
    const nextStep = () => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex >= steps.length) {
            setSteps([...steps, { id: nextIndex + 1, image: null, previewUrl: null, description: '' }]);
        }
        setCurrentStepIndex(nextIndex);
    };

    // 3. 手順を戻る
    const prevStep = () => {
        if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
    };

    // 4. 送信処理
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
            let fullComment = finalData.comment + "\n\n--- 調理ログ ---\n";
            steps.forEach((step, i) => {
                if (step.description) fullComment += `[手順${i + 1}] ${step.description}\n`;
            });

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
        } finally {
            setIsSubmitting(true);
        }
    };

    return (
        <Layout>
            <div className="relative z-10 max-w-2xl mx-auto mt-6 lg:mt-12 mb-20">
                <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden transition-all duration-300">

                    {/* ヘッダー（進捗） */}
                    <div className="bg-muted/50 px-6 py-4 border-b border-border flex justify-between items-center">
                        <span className="font-bold text-primary">
                            {phase === 'steps' ? `Step ${currentStepIndex + 1}` : phase === 'final' ? '完成!' : '最終確認'}
                        </span>
                        <div className="flex gap-1">
                            {steps.map((_, i) => (
                                <div key={i} className={`w-2 h-2 rounded-full ${i === currentStepIndex && phase === 'steps' ? 'bg-primary' : 'bg-gray-300'}`} />
                            ))}
                            <div className={`w-2 h-2 rounded-full ${phase === 'steps' ? 'bg-primary' : 'bg-gray-300'}`} />
                        </div>
                    </div>

                    {/* ボディ（コンテンツ切り替え） */}
                    <div className="p-6 min-h-[400px] flex flex-col">
                        {phase === 'steps' && (
                            <StepPhase
                                stepIndex={currentStepIndex}
                                stepData={steps[currentStepIndex]}
                                onImageChange={(e) => handleImageSelect(e, false)}
                                onTextChange={(text) => {
                                    const newSteps = [...steps];
                                    newSteps[currentStepIndex].description = text;
                                    setSteps(newSteps);
                                }}
                            />
                        )}
                        {phase === 'final' && (
                            <FinalPhase
                                data={finalData}
                                onImageChange={(e) => handleImageSelect(e, true)}
                                onUpdate={(updates) => setFinalData({ ...finalData, ...updates })}
                            />
                        )}
                        {phase === 'review' && (
                            <ReviewPhase
                                steps={steps}
                                finalData={finalData}
                            />
                        )}
                    </div>

                    {/* 3. フッター（ナビゲーションボタン） */}
                    <div className="bg-muted/50 px-6 py-4 bordet-t border-border flex justify-between">
                        {/* 戻るボタン */}
                        {phase === 'steps' && currentStepIndex === 0 ? (
                            <button onClick={() => navigate('/')} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">キャンセル</button>
                        ) : (
                            <button
                                onClick={() => {
                                    if(phase === 'review') setPhase('final');
                                    else if(phase === 'final') setPhase('steps');
                                    else prevStep();
                                }}
                                className="px-4 py-2 rounded-lg hover:bg-muted text-sm cursor-pointer"
                            >
                                戻る
                            </button>
                        )}

                        {/* 進むボタン */}
                        {phase === 'steps' ? (
                            <div className="flex gap-2">
                                <button onClick={() => setPhase('final')} className="px-4 py-2 text-sm text-primary font-bold hover:bg-primary/10 cursor-pointer rounded-lg">完成!</button>
                                <button onClick={nextStep} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 hover:scale-105 cursor-pointer transition-transform">次へ</button>
                            </div>
                        ) : phase === 'final' ? (
                            <button onClick={() => setPhase('review')} disabled={!finalData.image} className="px-6 py-2 bg-primary text-white rounded-lg shadow-lg hover:bg-primary/90 hover:scale-105 cursor-pointer transition-transform disabled:opacity-50">確認画面へ</button>
                        ) : (
                            <button onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-2 bg-primary text-white font-bold rounded-lg shadow-xl hover:bg-primary/90 hover:scale-105 cursor-pointer transition-transform">
                                {isSubmitting ? '保存中．．．' : 'ログを保存'}
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </Layout>
    );
};
