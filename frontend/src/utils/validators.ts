// バリデーションの設定値
export const TEXT_RULES = {
    MAX_LENGTH: 200,
    MAX_LINES: 10,
    INVALID_CHARS: /[<>]/,
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
