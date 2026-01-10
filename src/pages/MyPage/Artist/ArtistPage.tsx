
import { usePrincipalState } from "../../../stores/usePrincipalState";
import ArtistManagePage from "./ArtistManage/ArtistManagePage";
import ArtistApplyPage from "./ArtistApply/ArtistApplyPage";


// 아티스트 / 유저 분기 시켜줌

function ArtistPage() {
  const { principal, isAuthenticated } = usePrincipalState();

  if (!isAuthenticated || !principal) {
    return <div>로그인이 필요합니다.</div>;
  }

  return principal.artistStatus === "APPROVED" ? (
    <ArtistManagePage />
  ) : (
    <ArtistApplyPage />
  );
}

export default ArtistPage;