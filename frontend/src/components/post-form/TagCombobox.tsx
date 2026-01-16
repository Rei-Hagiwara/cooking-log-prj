import React, { useState, useEffect, useMemo } from 'react';
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxButton, ComboboxOption } from '@headlessui/react';
import { supabase } from '../../lib/supabase';

// タグの型定義
export type TagWithCategory = {
    id: string;
    name: string;
    category: {
        id: string;
        name: string;
    } | null;
};

type Props = {
    selectedTag: TagWithCategory | null;
    onSelect: (tag: TagWithCategory | null) => void;
};

/**
 * 料理のタグ選択ボックス
 * @param selectedTag   選択されたタグオブジェクト
 * @param onSelect      選択時の処理
 */
export const TagCombobox = ({ selectedTag, onSelect }: Props) => {
    const [query, setQuery] = useState('');
    const [tags, setTags] = useState<TagWithCategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [originalTag, setOriginalTag] = useState<TagWithCategory | null>(null);

    // 検索処理
    const searchTags = useMemo(() => {
        const search = async (q: string) => {
            if (q.length === 0) {
                setTags([]);
                return;
            }

            setIsLoading(true);
            const { data, error } = await supabase
                .from('tags')
                .select(`
                    id,
                    name,
                    category:categories (id, name)    
                `)
                .like('name', `%${q}%`)
                .limit(10);

            if (!error && data) {
                setTags(data as unknown as TagWithCategory[]);
            }
            setIsLoading(false);
        };

        // デバウンス（0.3秒遅延）
        let timer: NodeJS.Timeout;
        return (q: string) => {
            clearTimeout(timer);
            timer = setTimeout(() => search(q), 300);
        };
    }, []);

    // 入力変更時に検索処理をトリガー
    useEffect(() => {
        searchTags(query);
    }, [query, searchTags]);

    // マウント時に「オリジナル」タグを取得
    useEffect(() => {
        const fetchOriginalTag = async () => {
            const { data } = await supabase
                .from('tags')
                .select(`
                    id,
                    name,
                    category:categories (id, name)    
                `)
                .eq('name', 'オリジナル')
                .single();
            
            if (data) {
                setOriginalTag(data as unknown as TagWithCategory);
            }
        };
        fetchOriginalTag();
    }, []);

    return (
        <div className="relative w-full">
            <Combobox value={selectedTag} onChange={onSelect}>
                <div className="relative mt-1">
                    <div className="
                        relative w-full cursor-default overflow-hidden rounded-lg bg-background text-left border border-border 
                        focus-within:ring-2 focus-within:ring-primary focus-within:border-primary
                    ">
                        <ComboboxInput
                            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-foreground bg-transparent focus:ring-0 outline-none"
                            displayValue={(tag: TagWithCategory) => tag?.name || ''}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="料理の種類を検索（例：カレー）"
                        >
                        </ComboboxInput>
                        <ComboboxButton className="absolute inset-y-0 right-0 cursor-pointer flex items-center pr-2">
                            <span className="text-muted-foreground text-xs">▼</span>
                        </ComboboxButton>
                    </div>

                    <ComboboxOptions className="
                        absolute mt-1 max-h-60 w-full rounded-md bg-popover py-1 
                        overflow-auto text-base shadow-lg ring-1 ring-black ring-opacity-5 
                        focus:outline-none sm:text-sm z-50
                    ">
                        {/* 通常のタグ */}
                        {tags.map((tag) => (
                            // 重複防止 & 読み込み途中での選択防止
                            tag.name !== 'オリジナル' && (
                                <ComboboxOption
                                    key={tag.id}
                                    className={({focus}) => 
                                    `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                                        focus ? 'bg-primary text-white' : 'text-foreground'
                                    }`
                                }
                                value={tag}
                                >
                                    {({ selected, focus }) => (
                                        <div className="flex justify-between items-center">
                                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                {tag.name}
                                            </span>
                                            {tag.category && (
                                                <span className={`text-xs ${focus ? 'text-white/80' : 'text-muted-foreground'}`}>
                                                    {tag.category.name}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </ComboboxOption>
                            )
                        ))}
                        {/* 「オリジナル」タグ（常時表示） */}
                        {originalTag && (
                            <ComboboxOption
                                className={({focus}) => 
                                   `relative cursor-pointer select-none py-2 pl-4 pr-4 border-t border-border ${
                                        focus ? 'bg-primary text-white' : 'text-foreground'
                                    }`
                                }
                                value={originalTag}
                                disabled={!originalTag}
                            >
                                <span className="block truncate font-bold">オリジナルとして登録</span>
                                <span className="text-xs opacity-70 ml-2">（その他）</span>
                            </ComboboxOption>
                        )}

                        {/* ローディング中 */}
                        {isLoading && (
                            <div className="relative cursor-default select-none py-2 px-4 text-muted-foreground">
                                検索中...
                            </div>
                        )}
                    </ComboboxOptions>
                </div>
            </Combobox>
        </div>
    );
};
