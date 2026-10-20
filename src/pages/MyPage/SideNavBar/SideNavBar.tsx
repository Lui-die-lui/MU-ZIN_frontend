/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import type { ArtistStatus } from "../../../Types/auth";
import { buildMyPageNavItems, type NavItem } from "./navItems";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import ChevronIcon from "../../../components/common/Chevron";

type Props = {
  artistStatus: ArtistStatus;
  isAdmin?: boolean;
  // 뱃지(알림 카운트) 붙이고 싶을 때 - 이거 리스트 상태(000status) 받아와서 프론트에서도 가능!
  badgeMap?: Record<string, number>; // key -> count 라서
};

function SideNavBar({ artistStatus, isAdmin = false, badgeMap }: Props) {
  const navigate = useNavigate();
  const loc = useLocation();

  const items = buildMyPageNavItems(artistStatus).map((item) => ({
    ...item,
    badgeCount: badgeMap?.[item.key] ?? item.badgeCount,
  }));

  // const items = buildMyPageNavItems(artistStatus).map((item) => {
  //   // 탭 내 탭 뱃지
  //   const children = item.children?.map((child) => ({
  //     ...child,
  //     badgeCount: badgeMap?.[child.key] ?? child.badgeCount ?? 0,
  //   }));

  //   // 부모 뱃지 카운트 = 자식 뱃지카운트 더한 값
  //   const computedParentBadgeCount =
  //     children?.reduce((sum, child) => sum + (child.badgeCount ?? 0), 0) ?? 0;

  //   return {
  //     ...item,
  //     children,
  //     badgeCount: children?.length
  //       ? computedParentBadgeCount
  //       : (badgeMap?.[item.key] ?? item.badgeCount ?? 0),
  //   };
  // });

  // 아코디언 오픈 상태
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // 현재 경로가 예약 섹션 하위면 자동 오픈
  const shouldOpenReservations = useMemo(() => {
    return (
      loc.pathname.startsWith("/mypage/reservations") ||
      loc.pathname.startsWith("/mypage/reservations/request")
    );
  }, [loc.pathname]);

  // 현재 url이 예약관리쪽으로 바뀌면 자동으로 탭 열어둠 (닫는 건 사용자에게 맡김)
  // effect 대신 렌더 중에 이전 값과 비교해서 조정 (React 권장 패턴, 렌더 한 번 줄어듦)
  const [prevShouldOpen, setPrevShouldOpen] = useState(false);
  if (shouldOpenReservations !== prevShouldOpen) {
    setPrevShouldOpen(shouldOpenReservations);
    if (shouldOpenReservations && !openKeys.includes("reservations")) {
      setOpenKeys([...openKeys, "reservations"]);
    }
  }

  // 부모 메뉴 클릭 시 열림 / 닫힘
  const toggle = (key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  // 일반 유저 예약관리 선택 시 내 예약으로 바로 이동
  const goOrToggle = (parent: NavItem) => {
    const children = parent.children ?? [];
    if (children.length === 1 && children[0].to) {
      navigate(children[0].to);
    }
    toggle(parent.key);
  };

  // 일반 메뉴는 기존처럼 NavLink로 렌더
  const renderLeaf = (item: NavItem) => (
    <s.Item key={item.key}>
      <s.LinkItem to={item.to!} end={item.to === "/mypage"}>
        <span>{item.label}</span>
        {!!item.badgeCount && item.badgeCount > 0 && (
          <s.Badge aria-label={`${item.label} 알림 ${item.badgeCount}개`}>
            {item.badgeCount}
          </s.Badge>
        )}
      </s.LinkItem>
    </s.Item>
  );

  // 모바일 가로 칩 줄: 선택된 메뉴가 화면 밖이면 보이는 곳까지 옆으로 넘김
  const asideRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = asideRef.current;
    if (!el) return;
    // 레이아웃이 잡힌 다음 프레임에 계산 (바로 하면 폭이 0 이라 넘기지 못함)
    const id = requestAnimationFrame(() => {
      if (el.scrollWidth <= el.clientWidth) return;
      const active = el.querySelector<HTMLElement>("a.active");
      if (!active) return;
      const a = active.getBoundingClientRect();
      const box = el.getBoundingClientRect();
      el.scrollLeft += a.left - box.left - (box.width - a.width) / 2;
    });
    return () => cancelAnimationFrame(id);
  }, [loc.pathname]);

  return (
    <s.Aside ref={asideRef} aria-label="마이페이지 메뉴">
      <s.Title onClick={() => navigate("/mypage")}>마이페이지</s.Title>

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
              <s.ParentButton type="button" aria-expanded={isOpen} onClick={() => goOrToggle(item)}>
                <span>{item.label}</span>

                {!!item.badgeCount && item.badgeCount > 0 && (
                  <s.Badge
                    aria-label={`${item.label} 알림 ${item.badgeCount}개`}
                  >
                    {item.badgeCount}
                  </s.Badge>
                )}

                <s.Chevron data-open={isOpen} aria-hidden="true">
                  <ChevronIcon size={14} />
                </s.Chevron>
              </s.ParentButton>

              {/* 데스크톱은 닫히면 숨김, 모바일은 항상 칩으로 보임 (CSS) */}
              <s.ChildNav data-open={isOpen}>
                {item.children!.map((child) => (
                  <s.Item key={child.key}>
                    <s.ChildLinkItem
                      to={child.to!}
                      end={child.to === "/mypage/reservations"}
                    >
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
            </s.Item>
          );
        })}
      </s.Nav>

      {/* 관리자만: 관리자 페이지로 전환 (일반 메뉴와 섞지 않음) */}
      {isAdmin && (
        <s.SwitchButton type="button" onClick={() => navigate("/admin")}>
          관리자 페이지로 전환
        </s.SwitchButton>
      )}
    </s.Aside>
  );
}

export default SideNavBar;
