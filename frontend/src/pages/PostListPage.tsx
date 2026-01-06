import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Post } from '../types/Post';
import { RecipeCard } from '../components/ui/RecipeCard';
import { Layout } from '../components/layouts/Layout';

export const PostListPage: React.FC = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // ログインユーザーの投稿を取得
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);

            try{
                const { data, error } = await supabase
                    .from('posts')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // 取得したデータをセット
                setPosts(data as Post[]);

            } catch (err: any) {
                setError(`データの取得に失敗しました。：${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <Layout >
        <div className="p-4 sm:p-8 max-w-4xl mx-auto">
            {/* ログ一覧 */}
            <header className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-3xl font-bold text-gray-800">
                    あなたの料理ログ ({posts.length}件)
                </h2>
            </header>

            {/* エラー表示 */}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

            {/* ロード中 */}
            {loading && <p className="text-center text-gray-500">ログを読み込み中…</p>}

            {/* 投稿データの一覧表示 */}
            <div className="space-y-6">
                {posts.map((post) => (
                    <RecipeCard
                        key={post.id}
                        title={post.title}
                        imageUrl={post.image_url}
                        rating={post.rating}
                        date={new Date(post.created_at || '').toLocaleDateString('ja-JP')}
                    />
                ))}

                {/* 投稿が無い場合 */}
                {!loading && posts.length === 0 && (
                    <div className="text-center p-10 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">まだ料理ログがありません。上のボタンから投稿してみましょう！</p>
                    </div>
                )}
            </div>

            {/* 新規投稿ボタン（モバイル用） */}
            <button 
                onClick={() => navigate('/new')}
                className="
                    lg:hidden fixed bottom-6 right-6
                    w-14 h-14
                    bg-primary text-white
                    rounded-full 
                    shadow-xl shadow-black/40 dark:shadow-[0_0_20px_rgba(0,0,0,0.6)]
                    flex items-center justify-center
                    text-3xl
                    hover:scale-110 transition-transform
                    active:scale-95 active:shadow-md
                    cursor-pointer
                    z-40
                "
            >
                ＋
            </button>
        </div>
        </Layout>
    );
};
