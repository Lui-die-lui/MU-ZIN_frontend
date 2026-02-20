/** @jsxImportSource @emotion/react */
import * as s from "./styles";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { usePrincipalState } from "../../../../stores/usePrincipalState";
import type { TabItem } from "../../../../components/common/MypageTabBar/MypageTabBar";
import MypageTabBar from "../../../../components/common/MypageTabBar/MypageTabBar";

type AccountTab = "account" | "artist";

const ACCOUNT_TABS: readonly TabItem<AccountTab>[] = [
  { key: "account", label: "내 정보" },
  { key: "artist", label: "아티스트 프로필" },
];

function AccountLayout() {
  const { principal } = usePrincipalState();
  const isApprovedArtist = principal?.artistStatus === "APPROVED";

  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 현재 탭 판별
  const value: AccountTab = pathname.includes("/mypage/account/artist")
    ? "artist"
    : "account";

  // 아티스트 승인 여부에 따른 탭 노출
  const items = isApprovedArtist
    ? ACCOUNT_TABS
    : // artist가 아닌 tab만 보여줌
      (ACCOUNT_TABS.filter(
        (t) => t.key !== "artist",
      ) as readonly TabItem<AccountTab>[]);

  const handleChange = (next: AccountTab) => {
    if (next === "account") navigate("/mypage/account");
    if (next === "artist") navigate("/mypage/account/artist");
  };
  return (
    <div css={s.page}>
      <div css={s.container}>
        <div css={s.header}>
          <MypageTabBar value={value} items={items} onChange={handleChange} />
        </div>

        <div css={s.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AccountLayout;
