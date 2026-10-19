import { usePrincipalState } from "../../../stores/usePrincipalState";
import { Navigate } from "react-router-dom";
import { useMyArtistProfile } from "../../../hooks/ArtistProfile/useMyArtistProfile";

// 아티스트 / 유저 분기 시켜줌
// 심사 결과는 관리자가 바꾸므로 로그인 정보(앱 시작 때 받은 값)가 아니라 방금 받은 내 프로필 상태로 판단
// (예전: 반려돼도 새로고침 전까지 "심사 중" 화면으로 보내서 사유를 볼 수도, 신청서를 고칠 수도 없었음)
function ArtistPage() {
  const { principal, isAuthenticated } = usePrincipalState();
  const profileQ = useMyArtistProfile();

  if (!isAuthenticated || !principal) return <div>로그인이 필요합니다.</div>;
  if (!profileQ.isFetchedAfterMount && !profileQ.isError) return null;

  const status = profileQ.data?.status ?? principal.artistStatus;
  if (status === "PENDING") return <Navigate to="/mypage/artist/pending" replace />;
  if (status === "APPROVED") return <Navigate to="/mypage/artist/manage" replace />;
  return <Navigate to="/mypage/artist/apply" replace />; // NONE or REJECTED
}
export default ArtistPage;
