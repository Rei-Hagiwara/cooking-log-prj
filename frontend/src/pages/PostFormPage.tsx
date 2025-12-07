import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { PostInsert } from '../types/Post';
import { useNavigate } from 'react-router-dom';

// ログ投稿ページ
export const PostFormPage: React.FC = () => {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // フォーム送信時の処理
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || !imageFile) return;

        setIsSubmitting(true);
        setError(null);

        let imageUrl: string | null = null;
        let uploadDataPath: string | null = null;

        try {
            // 認証中のユーザーID取得
            const user = await supabase.auth.getUser();
            const userId = user.data.user?.id;
            if (!userId) throw new Error("ユーザーが認証されていません。");
            console.log('userId1' + userId);
            // 1.画像アップロード処理
            // ファイル名をユニークにする
            const fileExtention = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtention}`;
            // パス名（ユーザーID/ファイル名）
            const filePath = `${userId}/${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, imageFile, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) throw new Error(`画像アップロードエラー：${uploadError.message}`);

            uploadDataPath = uploadData.path;

            // 公開URLを取得
            const { data: publicUrlData } = supabase.storage
                .from('images')
                .getPublicUrl(uploadData.path);

            imageUrl = publicUrlData.publicUrl;

            // 2.ログデータ挿入処理
            const newPost: PostInsert = {
                user_id: userId,
                image_url: imageUrl,
                comment: comment || null,
                rating: rating,
            };
            console.log('userId2' + userId);
            const { error: dbError } = await supabase
                .from('posts')
                .insert([newPost]);

            if (dbError) throw new Error(`DB挿入エラー：${dbError.message}`);

            alert('投稿が完了しました！');
            navigate('/');  // 一覧画面へ遷移

        } catch (err: any) {
            setError(`投稿エラー： ${err.message || '不明なエラー'}`);
            // エラー時の処理（アップロード済みなら削除など）
            if (uploadDataPath) {
                await supabase.storage.from('images').remove([uploadDataPath]);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">新しい料理ログの投稿</h1>

            {/* エラー表示 */}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 画像選択フィールド */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">写真（必須）</label>
                    <input
                        id="image-file"
                        type="file"
                        accept="image/*"
                        required
                        onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                {/* コメントフィールド */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">コメント</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        rows={4}
                    />
                </div>

                {/* 評価フィールド */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">満足度</label>
                    <input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        value={rating ?? ''}
                        onChange={(e) => setRating(parseInt(e.target.value) || null)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>

                {/* 投稿ボタン */}
                <button
                    type="submit"
                    disabled={isSubmitting || !imageFile}
                    className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                    {isSubmitting ? '投稿中、、、' : '記録を投稿'}
                </button>
            </form>
        </div>
    );
};
