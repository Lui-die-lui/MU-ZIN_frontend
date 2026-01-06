/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { usePublicLessonDetail } from "../../../hooks/usePublicLessonDetail";
import SideDrawer from "../../../components/common/SideDrawer/SideDrawer";
import { AvatarCircle } from "../../MyPage/Home/ProfileHeaderCard/styles";
import { useState } from "react";

type Props = {
  open: boolean;
  lessonId: number | null;
  onClose: () => void;
};
function LessonDetailDrawer({ open, lessonId, onClose }: Props) {
  const id = lessonId ?? 0;
  const { data, isLoading, isError } = usePublicLessonDetail(id);

  // 이미지 깨졌을 때
  const [imgError, setImgError] = useState(false);

  const profileImgUrl =
    data?.artist?.profileImgUrl && !imgError ? data.artist.profileImgUrl : null;
  return (
    <SideDrawer open={open} onClose={onClose} title="레슨 상세" width={440}>
      {isLoading && <div css={s.stateText}>로딩중...</div>}
      {isError && <div css={s.stateText}>불러오기 실패</div>}

      {data && (
        <div css={s.wrap}>
          {/* 아티스트 헤더 */}
          <div css={s.artistHeader}>
            <div css={s.avatarCircle}>
              {profileImgUrl ? (
                <img
                  src={profileImgUrl}
                  alt={`${data.artist.username} 프로필`}
                  css={s.avatarImg}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div css={s.avatarFallback}>
                  {data.artist.username?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
            </div>

            <div css={s.artistMeta}>
              <div css={s.artistName}>{data.artist.username}</div>
            </div>
          </div>

          {/* 레슨 정보 */}
          <h2 css={s.title}>{data.title}</h2>

          <div css={s.metaRow}>
            <div>가격: {data.price ?? "문의"}</div>
            <div>시간: {data.durationMin}분</div>
          </div>

          {data.description && <div css={s.section}>{data.description}</div>}
          {data.requirementText && (
            <div css={s.section}>{data.requirementText}</div>
          )}
        </div>
      )}
    </SideDrawer>
  );
}

export default LessonDetailDrawer;
