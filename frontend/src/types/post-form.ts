import type { TagWithCategory } from '../components/post-form/TagCombobox';

/**
 * 調理手順のデータ
 * @param image         入力写真
 * @param previewUrl    写真確認用 公開URL
 * @param description   手順の詳細
 * @param commentError  コメントのバリデーションエラー
 * @param imageError    画像のバリデーションエラー
 */
export type CookingStep = {
    image: File | null;
    previewUrl: string | null;
    description: string;
    commentError?: string | null;
    imageError?: string | null;
};

/**
 * １つ分の料理データ
 * @param tempId        フロント管理用ID
 * @param name          料理名
 * @param tag_id        料理タグ
 * @param selectedTag   UI表示用選択タグオブジェクト
 * @param steps         調理手順（配列）
 * @param isSkipped     スキップフラグ
 * @param image         完成写真
 * @param previewUrl    写真確認用 公開URL
 * @param comment       料理コメント
 * @param rating        料理の評価
 * @param nameError     料理名のバリデーションエラー
 * @param commentError  コメントのバリデーションエラー
 * @param imageError    画像のバリデーションエラー
 */
export type DishFormData = {
    tempId: string;
    name: string;
    tag_id: string | null;
    selectedTag: TagWithCategory | null,
    steps: CookingStep[];
    isSkipped: boolean;

    // 以下「完成」フェーズで入力
    image: File | null;
    previewUrl: string | null;
    comment: string;
    rating: number;

    // バリデーションエラー
    nameError: string | null;
    commentError?: string | null;
    imageError?: string | null;
};

/**
 * 投稿全体データ
 * @param title         投稿タイトル
 * @param image         全体写真
 * @param previewUrl    写真確認用 公開URL
 * @param is_public     公開設定フラグ
 * @param titleError    投稿タイトルのバリデーションエラー
 * @param imageError    画像のバリデーションエラー
 */
export type OverallFormData = {
    title: string;
    image: File | null;
    previewUrl: string | null;
    is_public: boolean;
    titleError?: string | null;
    imageError?: string | null;
}
