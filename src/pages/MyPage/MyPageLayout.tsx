/** @jsxImportSource @emotion/react */
import { Outlet } from "react-router-dom";
import { usePrincipalState } from "../../stores/usePrincipalState";
import type { ArtistStatus } from "../../Types/auth";
import SideNavBar from "./SideNavBar/SideNavBar";
import * as s from "./styles";
import { useMyNotifications } from "../../hooks/notification/useMyNotifications";
import { useMemo } from "react";

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
  console.log("notifications:", notifications);
  console.log("isArray:", Array.isArray(notifications));
  console.log("type:", typeof notifications);

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
    <s.Wrap>
      <SideNavBar artistStatus={artistStatus} badgeMap={badgeMap} />
      <s.Content>
        <Outlet />
      </s.Content>
    </s.Wrap>
  );
}

export default MyPageLayout;
