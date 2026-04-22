/** @jsxImportSource @emotion/react */
import { Outlet } from "react-router-dom";
import { usePrincipalState } from "../../stores/usePrincipalState";
import type { ArtistStatus } from "../../Types/auth";
import SideNavBar from "./SideNavBar/SideNavBar";
import * as s from "./styles";
import { useMyNotifications } from "../../hooks/notification/useMyNotifications";
import { useMemo } from "react";

function MyPageLayout() {
  const { principal } = usePrincipalState();

  // principal 없으면 일단 NONE처리 (로그인 가드 로직 있으면 여긴 타지 않으나, 혹시 모르니)
  const artistStatus: ArtistStatus = (principal?.artistStatus ??
    "NONE") as ArtistStatus;

  const { data: notifications = [] } = useMyNotifications();

  const badgeMap = useMemo(() => {
    const reservationUnreadCount = notifications.filter(
      (notification) =>
        notification.refType === "RESERVATION" && !notification.isRead,
    ).length;

    return {
      reservations: reservationUnreadCount,
    };
  }, [notifications]);

  return (
    <s.Wrap>
      <SideNavBar
        artistStatus={artistStatus}
        badgeMap={badgeMap}
      />
      <s.Content>
        <Outlet />
      </s.Content>
    </s.Wrap>
  );
}

export default MyPageLayout;
