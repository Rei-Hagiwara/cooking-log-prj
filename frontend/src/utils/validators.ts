// テキスト用ルール
export const TEXT_RULES = {
    MAX_LENGTH: 200,
    MAX_LINES: 10,
    INVALID_CHARS: /[<>]/,
};

// 画像用ルール
export const IMAGE_RULES = {
    MAX_SIZE_MB: 5,
    MAX_SIZE_BYTES: 5 * 1024 * 1024,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};

/**
 * テキスト入力のバリデーションを行う
 * @param text 検証対象のテキスト
 * @returns エラーメッセージ（無ければnull）
 */
export const validateText = (text: string): string | null => {
    if (!text) return null;

    // 1．文字数チェック
    if (text.length > TEXT_RULES.MAX_LENGTH) {
        return `${TEXT_RULES.MAX_LENGTH}文字以内で入力してください（現在${text.length}文字）`;
    }

    // 2．行数チェック
    const lineCount = text.split('\n').length;
    if (lineCount > TEXT_RULES.MAX_LINES) {
        return `${TEXT_RULES.MAX_LINES}行以内で入力してください`;
    }

    // 3．入力不可文字チェック
    if (TEXT_RULES.INVALID_CHARS.test(text)) {
        return '一部使用できない文字（<, >）が含まれています';
    }

    return null;
};

/**
 * 画像入力のバリデーションを行う
 * @param file 検証対象の画像ファイル
 * @returns エラーメッセージ（無ければnull）
 */
export const validateImage = (file: File): string | null => {
    if (!file) return null;

    // 1．ファイル形式チェック
    if (!IMAGE_RULES.ALLOWED_TYPES.includes(file.type)) {
        return '対応していないファイル形式です（jpeg, png, webpのみ可）';
    }

    // 2．ファイルサイズチェック
    if (file.size > IMAGE_RULES.MAX_SIZE_BYTES) {
        return `ファイルサイズが大きすぎます（${IMAGE_RULES.MAX_SIZE_MB}MB以下にしてください）`;
    }

    return null;
};
