import { clsx, type ClassValue } from "clsx";   // 条件付き分でclassNameを結合する
import { twMerge } from "tailwind-merge";       // クラス衝突を解決する

// クラスの接続など
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
