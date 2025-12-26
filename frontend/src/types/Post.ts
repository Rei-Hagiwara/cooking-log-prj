// 投稿テーブル
export type Post = {
    id: string;
    user_id: string;
    comment?: string;
    rating?: number;
    image_url?: string;
    deleted_at?: string
    created_at: string;
    updated_at?: string;
    title?: string;
};

/**
 * 挿入時に利用する型
 */
export type PostInsert = Omit<Post, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
