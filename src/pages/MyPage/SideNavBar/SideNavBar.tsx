/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import type { ArtistStatus } from "../../../Types/auth";
import { buildMyPageNavItems, type NavItem } from "./navItems";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

type Props = {
  artistStatus: ArtistStatus;
  // 뱃지(알림 카운트) 붙이고 싶을 때 - 이거 리스트 상태(000status) 받아와서 프론트에서도 가능!
  badgeMap?: Record<string, number>; // key -> count 라서
};

function SideNavBar({ artistStatus, badgeMap }: Props) {
  const navigate = useNavigate();
  const loc = useLocation();

  const items = buildMyPageNavItems(artistStatus).map((item) => ({
    ...item,
    badgeCount: badgeMap?.[item.key] ?? item.badgeCount,
  }));

  // 아코디언 오픈 상태
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // 현재 경로가 예약 섹션 하위면 자동 오픈
  const shouldOpenReservations = useMemo(() => {
    return (
      loc.pathname.startsWith("/mypage/reservations") ||
      loc.pathname.startsWith("/mypage/artist/request")
    );
  }, [loc.pathname]);

  // 현재 url이 예약관리쪽이면 자동으로 탭 열어둠
  useEffect(() => {
    setOpenKeys((prev) => {
      if (shouldOpenReservations && !prev.includes("reservations")) {
        return [...prev, "reservations"];
      }
      // 강제로 닫거나 열지 않음
      return prev;
    });
  }, [shouldOpenReservations]);

  // 부모 메뉴 클릭 시 열림 / 닫힘
  const toggle = (key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  // 일반 메뉴는 기존처럼 NavLink로 렌더
  const renderLeaf = (item: NavItem) => {
    const end = item.to === "/mypage" || item.to === "/mypage/artist"; 
    // 상위 artist는 정확히 일치할 때만 active 이것도 안됨

    return (
      <s.Item key={item.key}>
        <s.LinkItem to={item.to!} end={end}>
          <span>{item.label}</span>
          {!!item.badgeCount && item.badgeCount > 0 && (
            <s.Badge aria-label={`${item.label} 알림 ${item.badgeCount}개`}>
              {item.badgeCount}
            </s.Badge>
          )}
        </s.LinkItem>
      </s.Item>
    );
  };

  return (
    <s.Aside>
      <s.Title onClick={() => navigate("/")}>MU:ZIN</s.Title>

      <s.Nav>
        {items.map((item) => {
          const isParent = !!item.children?.length;

          // 기존 leaf는 그대로
          if (!isParent) return renderLeaf(item);

          // parent(레슨/예약 관리)
          const isOpen = openKeys.includes(item.key);

          // parent badge: children 중 요청관리 badge를 여기 올리고 싶으면 badgeMap을 따로 주면 됨
          return (
            <s.Item key={item.key}>
              {/* 부모 클릭하면 펼침 */}
              <s.ParentButton type="button" onClick={() => toggle(item.key)}>
                <span>{item.label}</span>

                {!!item.badgeCount && item.badgeCount > 0 && (
                  <s.Badge
                    aria-label={`${item.label} 알림 ${item.badgeCount}개`}
                  >
                    {item.badgeCount}
                  </s.Badge>
                )}

                <s.Chevron data-open={isOpen}>▾</s.Chevron>
              </s.ParentButton>

              {isOpen && (
                <s.ChildNav>
                  {item.children!.map((child) => (
                    <s.Item key={child.key}>
                      <s.ChildLinkItem to={child.to!} end={false}>
                        <span>{child.label}</span>
                        {!!badgeMap?.[child.key] && badgeMap[child.key] > 0 && (
                          <s.Badge
                            aria-label={`${child.label} 알림 ${badgeMap[child.key]}개`}
                          >
                            {badgeMap[child.key]}
                          </s.Badge>
                        )}
                      </s.ChildLinkItem>
                    </s.Item>
                  ))}
                </s.ChildNav>
              )}
            </s.Item>
          );
        })}
      </s.Nav>
    </s.Aside>
  );
}

export default SideNavBar;
