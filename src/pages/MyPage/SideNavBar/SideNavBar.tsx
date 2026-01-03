/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import type { ArtistStatus } from "../../../Types/auth";
import { buildMyPageNavItems } from "./navItems";

type Props = {
  artistStatus: ArtistStatus;
  // 뱃지(알림 카운트) 붙이고 싶을 때 - 이거 리스트 상태(000status) 받아와서 프론트에서도 가능!
  badgeMap?: Record<string, number>; // key -> count 라서
};

function SideNavBar({ artistStatus, badgeMap }: Props) {
  const items = buildMyPageNavItems(artistStatus).map((item) => ({
    ...item,
    badgeCount: badgeMap?.[item.key] ?? item.badgeCount,
  }));

  return(
    <s.Aside>
        <s.Title>My page</s.Title>

        <s.Nav>
            {items.map((item) => (
                <s.Item key={item.key}>
                    <s.LinkItem
                    to={item.to}
                    // /mypage가 하위 라우트에서도 액티브 되는거 막기
                    end={item.to === "/mypage"}>

                        <span>{item.label}</span>
                        {!!item.badgeCount && item.badgeCount > 0 && (
                            <s.Badge aria-label={`${item.label} 알림 ${item.badgeCount}개`}>
                                {item.badgeCount}
                            </s.Badge>
                        )}
                    </s.LinkItem>
                </s.Item>
            ))}

        </s.Nav>


    </s.Aside>
  );
}

export default SideNavBar;
