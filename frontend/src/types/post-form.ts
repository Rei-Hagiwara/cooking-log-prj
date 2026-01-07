export type CookingStep = {
    id: number;
    image: File | null;
    previewUrl: string | null;
    description: string;
    error?: string | null;
};

export type FinalResult = {
    image: File | null;
    previewUrl: string | null;
    rating: number;
    comment: string;
    error?: string | null;
};
