/** @jsxImportSource @emotion/react */
import * as s from "../ArtistApply/styles";
import { Link, Navigate } from "react-router-dom";
import { useMyArtistProfile } from "../../../../hooks/ArtistProfile/useMyArtistProfile";

const p2 = (n: number) => String(n).padStart(2, "0");
const formatDt = (v?: string | null) => {
  if (!v) return null;
  const d = new Date(v);
  return `${d.getFullYear()}.${p2(d.getMonth() + 1)}.${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}`;
};

// 아티스트 신청 제출 후 (예전: "심사 진행중입니다." 한 줄)
function ArtistPendingPage() {
  const profileQ = useMyArtistProfile();
  const profile = profileQ.data;
  const submitted = formatDt(profile?.submittedDt);

  // 그 사이 승인/반려됐으면 (예: 반려 알림을 누르고 들어옴) 결과 화면으로
  if (profileQ.isFetchedAfterMount && profile && profile.status !== "PENDING") {
    return <Navigate to="/mypage/artist" replace />;
  }

  return (
    <div css={s.page}>
      <div css={s.header}>
        <h1 css={s.title}>아티스트 신청</h1>
      </div>
      <div css={s.pendingCard} role="status">
        <div css={s.pendingIcon} aria-hidden="true">
          ⏳
        </div>
        <strong>신청서를 심사하고 있어요</strong>
        <div>
          {submitted && (
            <>
              제출 {submitted}
              <br />
            </>
          )}
          심사가 끝나면 알림으로 알려드려요. 그동안은 신청서를 수정할 수 없어요.
        </div>
        <Link css={s.btn("ghost")} to="/mypage/artist/apply" style={{ display: "inline-flex", alignItems: "center", marginTop: 8, textDecoration: "none" }}>
          제출한 신청서 보기
        </Link>
      </div>
    </div>
  );
}

export default ArtistPendingPage;
