// 악기 카테고리 enum
export type InstrumentCategory = string;

export interface InstrumentResponse {
    instId: number;
    instName: string;
    category: InstrumentCategory;
}