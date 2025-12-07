import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Post } from '../types/Post';
import { useNavigate } from 'react-router-dom';

export const PostListPage: React.FC = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ログアウト処理
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error);
            alert('ログアウトに失敗しました');
        }
    };

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
        <div className="p-4 sm:p-8 max-w-4xl mx-auto">
            {/* ログ一覧 */}
            <header className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">
                    あなたの料理ログ ({posts.length}件)
                </h1>
                <div className="space-x-4">
                    <button
                        onClick={() => navigate('/new')}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                        新規投稿
                    </button>
                    {/* ログアウトボタン */}
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                        ログアウト
                    </button>
                </div>
            </header>

            {/* エラー表示 */}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

            {/* ロード中 */}
            {loading && <p className="text-center text-gray-500">ログを読み込み中…</p>}

            {/* 投稿データの一覧表示 */}
            <div className="space-y-6">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white shadow-lg rounded-lg overflow-hidden flex border">
                        {/* 画像表示 */}
                        {post.image_url && (
                            <div className="w-1/3 shrink-0">
                                <img
                                    src={post.image_url}
                                    alt="料理の写真"
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                        )}

                        {/* ログ詳細 */}
                        <div className={`p-4 ${post.image_url ? 'w-2/3' : 'w-full'}`}>
                            <p className="text-sm text-gray-500 mb-2">
                                投稿日：{new Date(post.created_at || '').toLocaleDateString('ja-JP')}
                            </p>
                            <p className="text-gray-800 mb-4">{post.comment}</p>
                            <div className="flex space-x-4 text-sm font-medium">
                                <span className="text-indigo-600">満足度：{post.rating}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* 投稿が無い場合 */}
                {!loading && posts.length === 0 && (
                    <div className="text-center p-10 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">まだ料理ログがありません。上のボタンから投稿してみましょう！</p>
                    </div>
                )}
            </div>
        </div>
    );
};
