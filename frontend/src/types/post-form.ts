export type CookingStep = {
    id: number;
    image: File | null;
    previewUrl: string | null;
    description: string;
};

export type FinalResult = {
    image: File | null;
    previewUrl: string | null;
    rating: number;
    comment: string;
};
