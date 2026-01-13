import { NavLink, Outlet } from "react-router-dom";
import { usePrincipalState } from "../../../../stores/usePrincipalState"

function AccountLayout() {
    const {principal} = usePrincipalState();
    const isApprovedArtist = principal?.artistStatus === "APPROVED";
  return (
      <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center"}}>
        <NavLink to="/mypage/account" >내 정보</NavLink>

        {isApprovedArtist && (
          <NavLink to="/mypage/account/artist">아티스트 프로필</NavLink>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <Outlet />
      </div>
    </div>
  )
}

export default AccountLayout
