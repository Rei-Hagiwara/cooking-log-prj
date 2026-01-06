import type { Meta, StoryObj } from '@storybook/react';
import { Layout } from '../components/layouts/Layout';
import { RecipeCard } from '../components/ui/RecipeCard';

const meta = {
    title: 'Layouts/Layout',
    component: Layout,
    parameters: {
        Layout: 'fullscreen',
    },
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
                <RecipeCard title="自家製パスタ" rating={4.5} date="12/25" />
                <RecipeCard title="冬のポトフ" rating={4.0} date="12/24" />
                <RecipeCard title="簡単オムライス" rating={5.0} date="12/23" />
                <RecipeCard isLoading={true} />
            </div>
        ),
    },
};
