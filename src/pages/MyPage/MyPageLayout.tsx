/** @jsxImportSource @emotion/react */
import { Outlet } from "react-router-dom";
import { usePrincipalState } from "../../stores/usePrincipalState";
import type { ArtistStatus } from "../../Types/auth";
import SideNavBar from "./SideNavBar/SideNavBar";
import * as s from "./styles";
import { Content } from "./styles";
import { Wrap } from "./styles";


function MyPageLayout() {
  const { principal } = usePrincipalState();

  // principal 없으면 일단 NONE처리 (로그인 가드 로직 있으면 여긴 타지 않으나, 혹시 모르니)
  const artistStatus: ArtistStatus = (principal?.artistStatus ??
    "NONE") as ArtistStatus;
  return (
    <s.Wrap>
      <SideNavBar 
      artistStatus={artistStatus}
      badgeMap={{reservations: 2}} // 확인용 하드코딩
      />
      <s.Content>
        <Outlet />
      </s.Content>
    </s.Wrap>
  );
}

export default MyPageLayout;
