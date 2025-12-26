import React from 'react';

type RecipeCardProps = {
    title?: string;
    imageUrl?: string;
    rating?: number;
    date?: string;
    isLoading?: boolean;    // 読み込み中フラグ
};

export const RecipeCard = ({
    title = 'レシピタイトル',
    imageUrl,
    rating = 0,
    date = "1/1",
    isLoading = false,
}: RecipeCardProps) => {
    // 読み込み中
    if (isLoading) {
        return (
            <div className="
                w-full max-w-[20rem] 
                overflow-hidden 
                rounded-2xl 
                border border-border 
                bg-card 
                shadow-sm 
                animate-pulse">
                {/* 画像セクションのプレースホルダー */}
                <div className="aspect-video w-full bg-muted" />
                {/* コンテンツセクションのプレースホルダー */}
                <div className="p-4 flex flex-col gap-2">
                    {/* タイトルのプレースホルダー */}
                    <div className="h-5 w-3/4 bg-muted rounded" />
                    {/* 満足度と投稿日のプレースホルダー */}
                    <div className="flex justify-between items-center">
                        <div className="h-4 w-12 bg-muted rounded" />
                        <div className="h-4 w-8 bg-muted rounded" />
                    </div>
                </div>
            </div>
        );
    }

    // 読み込み済み
    return (
        <div
            className="
                group relative
                w-full max-w-[20rem] 
                overflow-hidden rounded-2xl
                border border-border
                bg-card text-card-foreground
                shadow-sm transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-md
                cursor-pointer
            "
        >
            {/* 画像セクション */}
            <div className="aspect-video w-full bg-muted flex items-center justify-center text-sm">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        {/* Todo: カメラアイコンとか？ */}
                        <span className="text-sm">No Image</span>
                    </div>
                )}
            </div>

            {/* コンテンツセクション */}
            <div className="p-4 flex flex-col gap-2">
                {/* レシピタイトル */}
                <div className="font-bold text-lg leading-tight line-clamp-1">
                    {title}
                </div>

                {/* 満足度、投稿日 */}
                <div className="flex items-center justify-between mt-1">
                    {/* 満足度 */}
                    <div className="flex items-center gap-1">
                        <span className="text-primary text-lg">★</span>
                        <span className="font-medium text-sm">{rating.toFixed(1)}</span>
                    </div>
                    {/* 投稿日 */}
                    <div className="text-xs text-muted-foreground font-medium">
                        {date}
                    </div>
                </div>
            </div>
        </div>
    );
};
