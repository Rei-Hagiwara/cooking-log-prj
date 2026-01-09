import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { validateText, validateImage } from '../utils/validators';
import { Layout } from '../components/layouts/Layout';
import { StepPhase } from '../components/post-form/StepPhase';
import { FinalPhase } from '../components/post-form/FinalPhase';
import { ReviewPhase } from '../components/post-form/ReviewPhase';
import type { DishFormData, OverallFormData } from '../types/post-form';
import { DishListItem } from '../components/post-form/DishList';

export const PostFormPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting]           = useState(false);                                      // 送信中フラグ
    const [isSuccess, setIsSuccess]                 = useState(false);                                      // 投稿完了フラグ

    // --- State: 進行管理 ---
    const [globalPhase, setGlobalPhase]             = useState<'dish_edit' | 'overall_edit' >('dish_edit'); // 全体の進行管理（'dish_edit': 料理入力中, 'overall_edit': 全体入力中）
    const [wizzardPhase, setWizzardPhase]           = useState<'steps' | 'final' | 'review'>('steps');      // 各料理入力ウィザード内の進行管理（'steps': 調理手順, 'final': 完成品, 'review': 確認）
    const [currentStepIndex, setCurrentStepIndex]   = useState(0);                                          // 現在の調理手順インデックス番号

    // --- State: データ管理 ---
    const [dishList, setDishList]                   = useState<DishFormData[]>([]);                         // A．確定済み料理リスト
    const [currentDish, setCurrentDish]             = useState<DishFormData>(createEmptyDish());            // B．編集中の料理データ
    const [overallData, setOverallData]             = useState<OverallFormData>({                           // C．投稿まとめ
        title: '', image: null, previewUrl: null, is_public: false
    });

    // --- ヘルパー関数: 空の料理データ生成 ---
    function createEmptyDish(): DishFormData {
        return {
            tempId: crypto.randomUUID(),    // フロント管理用一意ID
            name: '', 
            tag_id: null, 
            steps: [{ image: null, previewUrl: null, description: '' }], 
            isSkipped: false,
            image: null, 
            previewUrl: null, 
            comment: '', 
            rating: 3,
            nameError: null,
            commentError: null,
            imageError: null,
        };
    }

    // --- 状態判定 ---
    const currentStep   = currentDish.steps[currentStepIndex];
    const hasContent    = !!currentStep?.image || (currentStep?.description || '').trim().length > 0; // 入力があるか（スキップ判定用）
    const hasStepError  = !!currentStep?.commentError || !!currentStep?.imageError;                   // 調理手順：バリデーションエラーがあるか

    // --- ハンドラー ---

    // 1. 画像選択時処理
    const handleImageSelect = ( e: React.ChangeEvent<HTMLInputElement>, target: 'step' | 'dish_final' | 'overall', ) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];

        // バリデーション実行
        const error = validateImage(file);
        // --- エラー時 ---
        if (error) {
            // 入力をクリア
            e.target.value = '';

            // 各フェーズ毎にエラーをセット
            if (target === 'step') {
                const newSteps = [...currentDish.steps];
                newSteps[currentStepIndex] = { ...newSteps[currentStepIndex], imageError: error};
                setCurrentDish(prev => ({ ...prev, steps: newSteps }));
            } else if (target === 'dish_final') {
                setCurrentDish(prev => ({ ...prev, imageError: error }));
            } else if (target === 'overall') {
                setOverallData(prev => ({ ...prev, imageError: error }));
            }
            return;
        }

        const url  = URL.createObjectURL(file);

        // --- 成功時 ---
        // フェーズ毎に登録
        if (target === 'step') {
            const newSteps              = [...currentDish.steps];
            newSteps[currentStepIndex]  = { ...newSteps[currentStepIndex], image: file, previewUrl: url, imageError: null };
            setCurrentDish(prev => ({ ...prev, steps: newSteps }));
        } else if (target === 'dish_final') {
            setCurrentDish(prev => ({ ...prev, image: file, previewUrl: url, imageError: null }));
        } else if (target === 'overall') {
            setOverallData(prev => ({ ...prev, image: file, previewUrl: url, imageError: null }));
        }
    };

    // 2．コメント変更時処理（調理手順）
    const handleStepTextChange = (text: string) => {
        // バリデーション実行
        const error = validateText(text);

        const newSteps = [...currentDish.steps];
        newSteps[currentStepIndex] = { ...newSteps[currentStepIndex], description: text, commentError: error };
        setCurrentDish(prev => ({ ...prev, steps: newSteps }));
    };

    // 3．調理手順の増減処理
    const nextStep = () => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex >= currentDish.steps.length) {
            // 新規：新しい調理手順を追加
            setCurrentDish(prev => ({
                ...prev,
                steps: [...prev.steps, { image: null, previewUrl: null, description: '' }]
            }));
        }
        setCurrentStepIndex(nextIndex);
    };
    const prevStep = () => {
        if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
    };

    // 4．調理手順スキップ処理
    const handleSkipSteps = () => {
        setCurrentDish(prev => ({
            ...prev,
            isSkipped: true,
            steps: []           // 調理手順を空にする
        }));
        setWizzardPhase('final');
    };
    
    // --- ハンドラー: リスト操作 ---

    // 1．料理をリストに追加（または更新）して、次へ
    const handleConfirmDish = (action: 'add_another' | 'finish') => {
        if (!currentDish.name) {
            alert("料理名を入力してください"); // ←他と同じようにバリデーションにしたい
            return;
        }

        setDishList(prev => {
            const index = prev.findIndex(d => d.tempId === currentDish.tempId);
            if (index !== -1) {
                // 編集の場合：更新
                const newList = [...prev];
                newList[index] = currentDish;
                return newList;
            } else {
                // 新規の場合：追加
                return [...prev, currentDish];
            }
        });

        if (action === 'add_another') {
            // 新しい調理手順をセット
            setCurrentDish(createEmptyDish());
            setCurrentStepIndex(0);
            setWizzardPhase('steps');
        } else {
            // 全体入力へ
            setGlobalPhase('overall_edit');
        }
    };

    // 2．料理の修正（リストからコピーしてcurrentDishへ）
    const handleEditDish = (tempId: string) => {
        const target = dishList.find(d => d.tempId === tempId);
        if (!target) return;

        setCurrentDish({...target});

        // 料理入力フェーズに切り替え
        setGlobalPhase('dish_edit');
        // 確認画面から再開
        setWizzardPhase('review');
    };

    // 3．リストの料理を削除
    const handleDeleteDish = (tempId: string) => {
        if(!confirm('この料理を削除しますか？')) return;
        setDishList(prev => prev.filter(d => d.tempId !== tempId));
    };

    // --- ハンドラー: 送信処理 ---
    const handleSubmit = async () => {
        if (isSubmitting) return;
        if (!overallData.title) return alert("投稿タイトルを入力してください"); // ←バリデーションでやりたい
        if (dishList.length === 0) return alert("料理が一つもありません");

        setIsSubmitting(true);
        try {
            const user      = await supabase.auth.getUser();
            const userId    = user.data.user?.id;
            if (!userId) throw new Error("ユーザー認証エラー");

            // 1．全体画像アップロード　←必須にする　バリデーション
            let overallImageUrl = null;
            if (overallData.image) {
                const fileExt = overallData.image.name.split('.').pop();
                const fileName = `main-${Date.now()}.${fileExt}`;
                const { data, error } = await supabase.storage
                    .from('images').upload(`${userId}/${fileName}`, overallData.image);

                if (error) throw error;
                if (data) {
                    const { data: publicUrl } = supabase.storage.from('images').getPublicUrl(data.path);
                    overallImageUrl = publicUrl.publicUrl;
                }
            }

            // 2．postsテーブル挿入
            const { data: postData, error: postError } = await supabase.from('posts').insert([{
                user_id: userId,
                title: overallData.title,
                image_url: overallImageUrl,
                overall_rating: null,
                is_public: overallData.is_public
            }]).select().single();

            if (postError) throw postError;
            const postId = postData.id;

            // 3．dishesテーブル挿入
            for (const dish of dishList) {
                // A．料理画像アップロード
                let dishImageUrl = null;
                if (dish.image) {
                    const fExt  = dish.image.name.split('.').pop();
                    const fName = `dish-${dish.tempId}-${Date.now()}.${fExt}`;
                    const { data, error } = await supabase.storage.from('images').upload(`${userId}/${fName}`, dish.image);

                    if (error) throw error;

                    if (data) {
                        const { data: url } = supabase.storage.from('images').getPublicUrl(data.path);
                        dishImageUrl = url.publicUrl;
                    }
                }

                // B．各手順画像のアップロード & JSON構築
                const stepsForJson = await Promise.all(dish.steps.map(async (step, i) => {
                    let stepImageUrl = null;
                    if (step.image) {
                        const fExt  = step.image.name.split('.').pop();
                        const fName = `step-${dish.tempId}-${i}-${Date.now()}.${fExt}`;
                        const { data, error } = await supabase.storage.from('images').upload(`${userId}/${fName}`, step.image);

                        if (error) throw error;

                        if (data) {
                            const { data: url } = supabase.storage.from('images').getPublicUrl(data.path);
                            stepImageUrl = url.publicUrl;
                        }
                    }
                    return {
                        description: step.description,
                        image_url: stepImageUrl,
                    };
                }));

                // C．DB挿入
                const { error: dishError } = await supabase.from('dishes').insert([{
                    post_id: postId,
                    name: dish.name,
                    category_id: null,  // 後で入力欄と一緒に追加
                    comment: dish.comment,
                    rating: dish.rating,
                    image_url: dishImageUrl,
                    steps: stepsForJson
                }]);

                if (dishError) throw dishError;
            }

            setIsSuccess(true);

        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- 表示用：現在の料理の番号 ---
    const existingIndex = dishList.findIndex(d => d.tempId === currentDish.tempId); // 確定済みの番号
    const hasConfirmed  = existingIndex !== -1 ? true : false;                      // 確定済みか新規か
    const dishNumber    = hasConfirmed ? existingIndex + 1 : dishList.length + 1;   // 料理の番号

    return (
        <Layout>
            <div className="z-10 max-w-2xl mx-auto mt-6 lg:mt-12 mb-10 px-4">
                        
                {isSuccess ? (
                    /* 投稿完了時UI */
                    <div
                        className="
                            bg-card border border-border rounded-xl shadow-2xl overflow-hidden min-h-125 
                            flex flex-col items-center justify-center p-8 
                            animate-in fade-in zoom-in duration-300 cursor-pointer hover:bg-muted/5 transition-colors
                        "
                        onClick={() => navigate('/')} // まだ詳細画面は作っていない
                    >
                        <div className="bg-primary/10 p-6 rounded-full mb-6">
                            <svg className="w-12 h-12 text-primary animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-foreground">記録を保存しました！</h2>
                        <p className="text-muted-foreground text-center mb-6">
                            タップして詳細を確認
                        </p>
                    </div>
                ) : (
                    <>
                        {/* --- フェーズ1：個別の料理入力 --- */}
                        {globalPhase === 'dish_edit' && (
                            <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden min-h-100 flex flex-col transition-all duration-500">

                                {/* ヘッダー（進捗） */}
                                <div className="bg-muted/50 px-6 py-4 border-b border-border flex justify-between items-center">
                                    <span className="font-bold text-primary">
                                        {hasConfirmed  
                                            ? `${dishNumber}つ目の料理` 
                                            : '新しい料理'
                                        }
                                    </span>
                                    <div className="text-xs text-muted-foreground font-bold bg-background px-2 py-1 rounded border">
                                        {wizzardPhase === 'steps' ? `手順 ${currentStepIndex + 1}` : wizzardPhase === 'final' ? '完成' : '確認'}
                                    </div>
                                </div>

                                {/* ボディ（ウィザード切り替え） */}
                                <div className="p-6 flex flex-col">
                                    {wizzardPhase === 'steps' && (
                                        <StepPhase
                                            stepIndex={currentStepIndex}
                                            stepData={currentDish.steps[currentStepIndex]}
                                            onImageChange={(e) => handleImageSelect(e, 'step')}
                                            onTextChange={handleStepTextChange}
                                            commentError={currentStep.commentError}
                                            imageError={currentStep.imageError}
                                        />
                                    )}
                                    {wizzardPhase === 'final' && (
                                        <FinalPhase
                                            data={currentDish}
                                            onImageChange={(e) => handleImageSelect(e, 'dish_final')}
                                            onUpdate={(updates) => {
                                                let newUpdates = { ...updates } as any;

                                                // 料理名バリデーション
                                                if (updates.name !== undefined) {
                                                    const err = validateText(updates.name);
                                                    newUpdates.nameError = err;
                                                    if (!updates.name) newUpdates.nameError = "料理名を入力してください";
                                                }

                                                // コメントバリデーション
                                                if (updates.comment !== undefined) {
                                                    newUpdates.commentError = validateText(updates.comment);
                                                }

                                                setCurrentDish(prev => ({ ...prev, ...newUpdates }))}
                                            }
                                            commentError={currentDish.commentError}
                                            nameError={currentDish.nameError}
                                            imageError={currentDish.imageError}
                                        />
                                    )}
                                    {wizzardPhase === 'review' && (
                                        <ReviewPhase
                                            dish={currentDish}
                                            isSkipped={currentDish.isSkipped}
                                        />
                                    )}
                                </div>

                                {/* 3. フッター（ナビゲーションボタン） */}
                                <div className="bg-muted/50 px-6 py-4 bordet-t border-border flex justify-between items-center">
                                    {/* 戻るボタン */}
                                    {wizzardPhase === 'steps' ? (
                                        currentStepIndex === 0 ? (
                                            // 最初の手順なら「キャンセル」か「まとめ画面」
                                            dishList.length > 0 ? (
                                                <button 
                                                    onClick={() => setGlobalPhase('overall_edit')} 
                                                    className="text-sm text-muted-foreground transition ease-in duration-150 hover:text-foreground cursor-pointer"
                                                >
                                                    ← 投稿まとめへ
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => navigate('/')} 
                                                    className="text-sm text-muted-foreground transition ease-in duration-150 hover:text-foreground cursor-pointer"
                                                >
                                                    キャンセル
                                                </button>
                                            )
                                        ) : (
                                            <button 
                                                onClick={prevStep} 
                                                className="px-4 py-2 rounded-lg transition ease-in duration-150 hover:bg-muted text-sm cursor-pointer"
                                            >
                                                戻る
                                            </button>
                                        )
                                    ) : wizzardPhase === 'final' ? (
                                        <button 
                                            onClick={() => {
                                                // スキップしていた場合は空の調理手順を作成して戻る
                                                if (currentDish.steps.length === 0) {
                                                    setCurrentDish(prev => ({
                                                        ...prev,
                                                        isSkipped: false,
                                                        steps: [{ image: null, previewUrl: null, description: '' }]
                                                    }));
                                                    setCurrentStepIndex(0);
                                                }
                                                setWizzardPhase('steps')} 
                                            }
                                            className="text-sm text-muted-foreground transition ease-in duration-150 hover:text-foreground cursor-pointer"
                                        >
                                            ← 調理手順
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => setWizzardPhase('final')} 
                                            className="text-sm text-muted-foreground transition ease-in duration-150 hover:text-foreground cursor-pointer"
                                        >
                                            編集に戻る
                                        </button>
                                    )}

                                    {/* 進むボタン */}
                                    {wizzardPhase === 'steps' ? (
                                        <div className="flex gap-2">
                                            {/* Step 1が空なら「スキップ」ボタン、入力済みなら「完成」ボタン */}
                                            {currentStepIndex === 0 && !hasContent ? (
                                                <button
                                                    onClick={handleSkipSteps}
                                                    className="px-4 py-2 text-sm font-bold text-muted-foreground text-muted-foreground hover:text-primary cursor-pointer transition ease-in duration-150"
                                                >
                                                    スキップ
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => setWizzardPhase('final')} 
                                                    disabled={hasStepError}
                                                    className={`
                                                        px-4 py-2 text-sm font-bold text-muted-foreground text-muted-foreground 
                                                        ${hasStepError
                                                            ? ''
                                                            : 'hover:text-primary cursor-pointer transition ease-in duration-150'
                                                        }
                                                    `}
                                                >
                                                    完成!
                                                </button>
                                            )}

                                            {/* 次の調理手順ボタン（入力必須） */}
                                            <button 
                                                onClick={nextStep} 
                                                disabled={!hasContent || hasStepError}
                                                className={`
                                                    px-6 py-2 bg-primary rounded-lg font-bold
                                                    ${!hasContent || hasStepError
                                                        ? 'text-white/80' 
                                                        : 'text-white hover:bg-primary/90 hover:scale-105 cursor-pointer transition-transform'
                                                    }
                                                `}
                                            >
                                                次へ
                                            </button>
                                        </div>
                                    ) : wizzardPhase === 'final' ? (
                                        /* 完成 → 確認画面ボタン（入力必須） */
                                        <button
                                            onClick={() => setWizzardPhase('review')}
                                            disabled={!(currentDish.name && currentDish.image) || hasStepError}
                                            className={`
                                                px-6 py-2 bg-primary rounded-lg font-bold
                                                ${!(currentDish.name && currentDish.image) || hasStepError
                                                    ? 'text-white/80' 
                                                    : 'text-white hover:bg-primary/90 hover:scale-105 cursor-pointer transition-transform'
                                                }
                                            `}
                                        >
                                            確認画面へ
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleConfirmDish('add_another')}
                                                className="px-4 py-2 border border-primary text-primary font-bold rounded-lg hover:bg-primary/5 cursor-pointer"
                                            >
                                                + 料理を追加
                                            </button>
                                            <button 
                                                onClick={() => handleConfirmDish('finish')} 
                                                disabled={isSubmitting} 
                                                className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary/90 cursor-pointer"
                                            >
                                                投稿まとめへ
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* --- フェーズ2：投稿まとめの入力 --- */}
                        {globalPhase === 'overall_edit' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                                {/* 料理リスト */}
                                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                                    <h2 className="text-lg font-bold mb-4">作った料理</h2>
                                    <div className="space-y-4">
                                        {dishList.map((dish, index) => (
                                            <div key={dish.tempId} className="md:snap-start shrink-0">
                                                <DishListItem
                                                    dish={dish}
                                                    index={index}
                                                    onEdit={() => handleEditDish(dish.tempId)}
                                                    onDelete={() => handleDeleteDish(dish.tempId)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => {
                                            setCurrentDish(createEmptyDish());
                                            setCurrentStepIndex(0);
                                            setWizzardPhase('steps')
                                            setGlobalPhase('dish_edit')
                                        }}
                                        className="w-full mt-4 py-3 border-2 border-dashed border-primary/30 text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                                    >
                                        + 料理を追加する
                                    </button>
                                </div>

                                {/* 投稿まとめ入力欄 */}
                                <div className="bg-card border border-border rounded-xl p-6 shadow-xl">
                                    <h2 className="text-xl font-bold mb-6 text-center">投稿のまとめ</h2>

                                    <div className="mb-6">
                                        <label className="block text-sm font-bold mb-2">タイトル</label>
                                        <input
                                            type="text"
                                            className={`
                                                w-full p-2 bg-background border rounded-lg focus:ring-2 outline-none font-bold
                                                ${overallData.titleError 
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-border focus:ring-primary'
                                                }
                                            `}
                                            placeholder="今日の晩御飯．．．"
                                            value={overallData.title}
                                            onChange={e => {
                                                // バリデーション実行
                                                let err = validateText(e.target.value);
                                                if(!e.target.value) err = "タイトルを入力してください"
                                                setOverallData({...overallData, title: e.target.value, titleError: err })
                                            }}
                                        />
                                        {/* バリデーションエラー */}
                                        {overallData.titleError && (
                                            <p className="text-xs text-red-500 mt-1 font-bold">{overallData.titleError}</p>
                                        )}
                                    </div>

                                    <div className="mb-8">
                                        <label className="block text-sm font-bold mb-2">全体写真</label>
                                        <label className={`
                                            w-full h-48 border-2 border-dashed rounded-lg 
                                            flex items-center justify-center cursor-pointer hover:bg-muted/50 bg-muted/20 relative overflow-hidden
                                            ${overallData.imageError
                                                ? 'border-red-500'
                                                : 'border-border'
                                            }
                                        `}>
                                            <input type="file" className="hidden" accept="image/*" onChange={e => handleImageSelect(e, 'overall')} />
                                            {overallData.previewUrl ? (
                                                <img src={overallData.previewUrl} className="w-full h-full object-cover" alt="Overall" />
                                            ) : (
                                                <div className="text-center text-muted-foreground">
                                                    <span className="text-3xl block mb-2">📸</span>
                                                    <span className="text-xs">全体写真</span>
                                                </div>
                                            )}
                                        </label>
                                        {/* バリデーションエラー */}
                                        { overallData.imageError && (
                                            <p className="text-xs text-red-500 mt-1 font-bold">{overallData.imageError}</p>
                                        )}
                                    </div>

                                    <button 
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !overallData.title || !overallData.image || dishList.length === 0 || !!overallData.titleError || !!overallData.imageError }
                                        className={`
                                            w-full py-4 rounded-xl text-foreground font-bold text-lg shadow-lg transition-all
                                            ${isSubmitting || !overallData.title || !overallData.image || dishList.length === 0 || !!overallData.titleError || !!overallData.imageError
                                                ? 'bg-muted-foreground/30 cursor-now-allowed'
                                                : 'bg-primary hover:bg-primary/90 hover:scale-[1.02] cursor-pointer'
                                            }
                                        `}
                                    >
                                        {isSubmitting ? '保存中...' : '投稿を完了する ✅'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};
