import type { Meta, StoryObj } from '@storybook/react';
import { RecipeCard } from '../components/ui/RecipeCard';

const meta = {
    title: 'Components/RecipeCard',
    component: RecipeCard,
    parameters: {
        Layout: 'centered',
    },
} satisfies Meta<typeof RecipeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// 画像あり
export const WithImage: Story = {
    args: {
        title: "自家製トマトケチャップソースのフレンチパスタ",
        imageUrl: "https://images.unsplash.com/photo-1626844131082-256783844137?q=80&w=600&auto=format&fit=crop",
        rating: 4.5,
        date: "12/05",
    },
};

// 画像なし
export const WithoutImage: Story = {
    args: {
        title: "画像無し",
    },
};

// 読み込み中
export const Loading: Story = {
    args: {
        isLoading: true,
    },
};
