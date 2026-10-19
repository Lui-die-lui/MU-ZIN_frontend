/** @jsxImportSource @emotion/react */
import { Outlet } from "react-router-dom";
import { usePrincipalState } from "../../stores/usePrincipalState";
import type { ArtistStatus } from "../../Types/auth";
import SideNavBar from "./SideNavBar/SideNavBar";
import NavBar from "../../components/layout/NavBar/NavBar";
import * as s from "./styles";
import { useMyNotifications } from "../../hooks/notification/useMyNotifications";
import { useMemo } from "react";
import { useIsAdmin } from "../../hooks/admin/useAdmin";

function MyPageLayout() {
  const { principal, hydrated } = usePrincipalState();

  // principal 없으면 일단 NONE처리 (로그인 가드 로직 있으면 여긴 타지 않으나, 혹시 모르니)
  const artistStatus: ArtistStatus = (principal?.artistStatus ??
    "NONE") as ArtistStatus;

  // 알림 배열 비는 순간 관련 문제
  const canFetchNotifications = hydrated && !!principal?.userId;
  const { data: notifications = [] } = useMyNotifications({
    enabled: canFetchNotifications,
  });

  const isAdmin = useIsAdmin();

  const badgeMap = useMemo(() => {
    // 내 예약 알림
    const myReservationUnreadCount = notifications.filter(
      (notification) =>
        notification.refType === "RESERVATION" &&
        notification.type !== "RESERVATION_REQUESTED" &&
        !notification.isRead,
    ).length;

    // 요청 알림
    const artistRequestUnreadCount = notifications.filter(
      (notification) =>
        notification.refType === "RESERVATION" &&
        notification.type === "RESERVATION_REQUESTED" &&
        !notification.isRead,
    ).length;

    return {
      reservations: myReservationUnreadCount + artistRequestUnreadCount,
      myReservations: myReservationUnreadCount,
      artistRequests: artistRequestUnreadCount,
    };
  }, [notifications]);

  return (
    <>
      {/* 다른 화면과 같은 상단 메뉴 (예전엔 마이페이지에서만 숨겨서 레슨·아티스트로 바로 갈 수 없었음) */}
      <NavBar />
      <s.Wrap>
        <SideNavBar artistStatus={artistStatus} isAdmin={isAdmin} badgeMap={badgeMap} />
        <s.Content>
          <Outlet />
        </s.Content>
      </s.Wrap>
    </>
  );
}

export default MyPageLayout;
