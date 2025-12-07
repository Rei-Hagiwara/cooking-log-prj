// 投稿テーブル
export type Post = {
    id: string;
    user_id: string;
    comment: string | null;
    rating: number | null;
    image_url: string | null;
    deleted_at: string | null
    created_at: string;
    updated_at: string;
};

/**
 * 挿入時に利用する型
 */
export type PostInsert = Omit<Post, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
