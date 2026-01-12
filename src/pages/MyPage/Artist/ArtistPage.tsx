
import { usePrincipalState } from "../../../stores/usePrincipalState";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


// 아티스트 / 유저 분기 시켜줌

function ArtistPage() {
  const { principal, isAuthenticated } = usePrincipalState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !principal) return;

    const status = principal.artistStatus;

    if (status === "PENDING") navigate("/mypage/artist/pending", { replace: true });
    else if (status === "APPROVED") navigate("/mypage/artist/manage", { replace: true });
    else navigate("/mypage/artist/apply", { replace: true }); // NONE or REJECTED
  }, [isAuthenticated, principal, navigate]);

  if (!isAuthenticated || !principal) return <div>로그인이 필요합니다.</div>;
  return null;
}
export default ArtistPage;