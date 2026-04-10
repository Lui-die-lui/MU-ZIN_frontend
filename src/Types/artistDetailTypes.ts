import type { ArtistProfileResponse } from "./artistApplyTypes";
import type { LessonStyleTagResponse } from "./lessonTypes";

// 이미 만들어 둔 타입 재사용
export type ArtistProfileDetailResp = ArtistProfileResponse & {
  styleTags: LessonStyleTagResponse[];
};

