// 옵션으로 문자열을 받을때 | Id 넘버 등으로 받을때 나눔
// UI 재사용성 높여줌
export type Option<T extends string | number> = { value: T; label: string };
