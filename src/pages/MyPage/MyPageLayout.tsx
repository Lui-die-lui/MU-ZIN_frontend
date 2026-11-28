/** @jsxImportSource @emotion/react */
import { Outlet, useLocation } from "react-router-dom";
import { outside as footerOutside } from "../../components/layout/Footer/styles";
import { usePrincipalState } from "../../stores/usePrincipalState";
import type { ArtistStatus } from "../../Types/auth";
import SideNavBar from "./SideNavBar/SideNavBar";
import NavBar from "../../components/layout/NavBar/NavBar";
import Footer from "../../components/layout/Footer/Footer";
import * as s from "./styles";
import { useMyNotifications } from "../../hooks/notification/useMyNotifications";
import { useMemo } from "react";
import { useIsAdmin } from "../../hooks/admin/useAdmin";

function MyPageLayout() {
  const { pathname } = useLocation();
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
    // 아티스트(요청 받은 쪽)에게 오는 알림 = 요청 관리 소속
    // 새 요청 / 수강생 취소 / 레슨 끝나서 완료 처리 필요 (푸시 링크도 같은 기준으로 /mypage/reservations/requests)
    const isArtistSide = (type: string) =>
      type === "RESERVATION_REQUESTED" ||
      type === "RESERVATION_CANCELED_BY_USER" ||
      type === "RESERVATION_COMPLETION_PENDING";

    const unreadReservation = notifications.filter(
      (notification) => notification.refType === "RESERVATION" && !notification.isRead,
    );

    // 내 예약 알림 (내가 신청한 예약의 확정·거절·취소·만료·완료)
    const myReservationUnreadCount = unreadReservation.filter(
      (notification) => !isArtistSide(notification.type),
    ).length;

    // 요청 알림
    const artistRequestUnreadCount = unreadReservation.filter(
      (notification) => isArtistSide(notification.type),
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
      {/* 채팅은 화면 높이를 채우는 대화창이라 하단 푸터 없음 */}
      {!pathname.startsWith("/mypage/chats") && (
        <div css={footerOutside}>
          <Footer />
        </div>
      )}
    </>
  );
}

export default MyPageLayout;
