/** @jsxImportSource @emotion/react */
import * as s from "./styles";

import { PiBellSimpleThin, PiCalendarDotsThin, PiChatCircleDotsThin } from "react-icons/pi";
import { useChatUnread } from "../../../hooks/chat/useChat";
import { dropdownCaret } from "../../common/dropdownStyles";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePrincipalState } from "../../../stores/usePrincipalState";
import { useIsAdmin } from "../../../hooks/admin/useAdmin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "../../../hooks/notification/notificationKeys";
import {
  getMyNotificationsReq,
  getMyUnreadCountReq,
  markAllReadReq,
  markReadReq,
} from "../../../apis/notification/notificationApis";
import { useMenuAnchor } from "../../../hooks/useMenuAnchor";
import type { NotificationResponse } from "../../../Types/notificationTypes";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

const formatNotificationTime = (value: string) => {
  const createdAt = new Date(value);
  if (Number.isNaN(createdAt.getTime())) return "";

  const diffMinutes = Math.floor(
    Math.max(0, Date.now() - createdAt.getTime()) / 60_000,
  );
  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const options: Intl.DateTimeFormatOptions =
    createdAt.getFullYear() === new Date().getFullYear()
      ? { month: "long", day: "numeric" }
      : { year: "numeric", month: "long", day: "numeric" };
  return new Intl.DateTimeFormat("ko-KR", options).format(createdAt);
};

function NavBar() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { principal } = usePrincipalState();
  const logout = usePrincipalState((s) => s.logout);

  const navItems = [
    // { path: "/", label: "홈" },
    { path: "/lessons", label: "레슨" },
    { path: "/artists", label: "아티스트" },
  ];

  const onLogout = () => {
    logout();
    navigate("/signin", { replace: true });
  };

  const notiMenu = useMenuAnchor<HTMLButtonElement>();
  const chatUnreadQ = useChatUnread(!!principal);
  const chatUnread = chatUnreadQ.data ?? 0;
  const profileMenu = useMenuAnchor<HTMLButtonElement>();

  // 화면이 바뀌면 열려 있던 메뉴는 닫음 (뒤로 가기 등 메뉴 밖에서 이동한 경우)
  const { pathname } = useLocation();
  const closeNoti = notiMenu.onClose;
  const closeProfile = profileMenu.onClose;
  useEffect(() => {
    closeNoti();
    closeProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 경로가 바뀔 때만
  }, [pathname]);

  // 메뉴가 열려 있어도 페이지 스크롤은 막지 않음(disableScrollLock) -> 대신 스크롤하면 닫음
  // (상단 메뉴는 화면에 붙어 있지만 MUI 메뉴는 문서 위치에 그려져서, 스크롤하면 버튼과 메뉴가 떨어짐)
  const anyMenuOpen = notiMenu.open || profileMenu.open;
  useEffect(() => {
    if (!anyMenuOpen) return;
    const onScroll = () => {
      closeNoti();
      closeProfile();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 열림 상태가 바뀔 때만
  }, [anyMenuOpen]);

  // 스크롤을 내렸을 때만 상단 메뉴 아래 옅은 그림자
  const [scrolled, setScrolled] = useState(() => window.scrollY > 4);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 안읽음 상태 뱃지용(unreadCount는 로그인 상태면 항상 가져와도 ok)
  const unreadQ = useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: getMyUnreadCountReq,
    enabled: !!principal,
    select: (resp) => resp.data.data ?? 0, // count number로 변환
    refetchInterval: 5000, // 아직 실시간 안붙여서 뱃지만 가볍게 폴링
  });

  // 알림 메뉴 열렸을 때만 가져오는 리스트용
  const notiListQ = useQuery({
    queryKey: notificationKeys.list(),
    queryFn: async () => {
      const resp = await getMyNotificationsReq();
      return Array.isArray(resp.data.data) ? resp.data.data : [];
    },
    enabled: !!principal && notiMenu.open,
  });

  // 전체 알림 읽기
  const markAllReadM = useMutation({
    mutationFn: markAllReadReq,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: notificationKeys.list() });
      await qc.invalidateQueries({ queryKey: notificationKeys.unread() });
    },
  });

  // 단일 알림 읽기
  const markReadM = useMutation({
    mutationFn: (id: number) => markReadReq(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: notificationKeys.list() });
      await qc.invalidateQueries({ queryKey: notificationKeys.unread() });
    },
  });

  // 안읽은 알림
  const unread = unreadQ.data ?? 0;

  // 새 알림이 오면(안 읽은 개수 변화) 목록도 새로 - 종 메뉴와 마이페이지 뱃지가 3분 캐시에 머물지 않게
  useEffect(() => {
    if (principal) qc.invalidateQueries({ queryKey: notificationKeys.list() });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 개수가 바뀔 때만
  }, [unread]);
  const notifications = notiListQ.data ?? [];

  // 알림 종류별 이동: 리뷰 알림은 리뷰 관리(받은 리뷰 / 내가 쓴 리뷰), 그 외는 예약 화면
  const goByNoti = (n: NotificationResponse) => {
    if (n.type === "REVIEW_CREATED") navigate("/mypage/reviews?tab=received");
    else if (n.type === "REVIEW_REPLIED") navigate("/mypage/reviews?tab=written");
    else if (n.type === "INQUIRY_CREATED") navigate("/mypage/inquiries?tab=received");
    else if (n.type === "INQUIRY_REPLIED") navigate("/mypage/inquiries?tab=sent");
    else if (n.type === "INQUIRY_TO_CHAT" && n.refId) navigate(`/mypage/chats/${n.refId}`);
    else if (n.type === "ARTIST_APPROVED" || n.type === "ARTIST_REJECTED") {
      // 심사 결과로 아티스트 상태가 바뀌었으므로 로그인 정보·내 프로필을 새로 받고 이동 (메뉴도 바로 바뀜)
      usePrincipalState.getState().refreshPrincipal();
      qc.invalidateQueries({ queryKey: ["myArtistProfile"] });
      navigate("/mypage/artist");
    }
    else navigate("/mypage/reservations");
    if (!n.isRead) markReadM.mutate(n.notificationId);
    notiMenu.onClose();
  };

  // 프로필 메뉴: 이동 전에 메뉴를 닫음 (NavBar 는 화면이 바뀌어도 그대로라 안 닫으면 열린 채 남음)
  const goFromProfile = (path: string) => {
    profileMenu.onClose();
    navigate(path);
  };

  const isAdmin = useIsAdmin();

  // 아티스트 상태에 따라 보이는 메뉴
  const artistMenuItems: { label: string; path: string }[] =
    principal?.artistStatus === "APPROVED"
      ? [
          { label: "예약 요청 관리", path: "/mypage/reservations/requests" },
          { label: "내 레슨 관리", path: "/mypage/artist/manage" },
        ]
      : principal?.artistStatus === "PENDING"
        ? [{ label: "아티스트 심사 현황", path: "/mypage/artist/pending" }]
        : [{ label: "아티스트 신청", path: "/mypage/artist/apply" }];
  
  return (
    <s.Header data-scrolled={scrolled}>
      <s.Left>
        <s.Logo to="/" aria-label="MU:ZIN 홈">
          MU<span aria-hidden="true">:</span>ZIN
        </s.Logo>

        <s.Nav>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? "active" : "")}
              css={s.link}
              end={item.path === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </s.Nav>
      </s.Left>

      <s.Right>
        {principal ? (
          <>
            {/* 채팅 - 안 읽은 메시지 수 */}
            <s.IconBtn
              onClick={() => navigate("/mypage/chats")}
              aria-label={chatUnread > 0 ? `채팅, 안 읽은 메시지 ${chatUnread}개` : "채팅"}
              title="채팅"
            >
              <PiChatCircleDotsThin aria-hidden="true" />
              {chatUnread > 0 && <s.Badge aria-hidden="true">{chatUnread > 99 ? "99+" : chatUnread}</s.Badge>}
            </s.IconBtn>

            {/* 일정 - 알림 종과 같은 Phosphor Thin 아이콘 */}
            <s.IconBtn
              onClick={() => navigate("/mypage/reservations")}
              aria-label="내 일정"
              title="내 일정"
              data-optional="true"
            >
              <PiCalendarDotsThin aria-hidden="true" />
            </s.IconBtn>
            {/* <s.Btn onClick={onLogout}>로그아웃</s.Btn> */}

            {/* 알림 */}
            <s.IconBtn
              ref={notiMenu.anchorRef}
              onClick={notiMenu.onOpen}
              aria-label={unread > 0 ? `알림, 읽지 않은 알림 ${unread}개` : "알림"}
              aria-haspopup="menu"
              aria-expanded={notiMenu.open}
              data-open={notiMenu.open}
            >
              <PiBellSimpleThin />
              {unread > 0 && <s.Badge>{unread > 99 ? "99+" : unread}</s.Badge>}
            </s.IconBtn>

            <Menu
              anchorEl={notiMenu.anchorEl}
              // 열 때 페이지 스크롤을 잠그면 MUI 가 스크롤바만큼 오른쪽 여백을 넣어 화면이 옆으로 흔들림
              disableScrollLock
              open={notiMenu.open}
              onClose={notiMenu.onClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{
                paper: {
                  sx: {
                    width: "min(380px, calc(100vw - 24px))",
                    maxHeight: "min(560px, calc(100vh - 80px))",
                    mt: 0.75,
                    border: "1px solid #e2e5e9",
                    borderRadius: "14px",
                    boxShadow: "0 18px 45px rgba(17, 24, 39, 0.14)",
                    overflow: "hidden",
                  },
                },
                list: { sx: { p: 0 } },
              }}
            >
              <s.MenuHeader>
                <div>
                  <strong>알림</strong>
                  <span>
                    {unread > 0
                      ? `읽지 않은 알림 ${unread}개`
                      : "새 알림이 없습니다"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => markAllReadM.mutate()}
                  disabled={unread === 0 || markAllReadM.isPending}
                >
                  {markAllReadM.isPending ? "처리 중" : "모두 읽음"}
                </button>
              </s.MenuHeader>

              {notiListQ.isPending ? (
                <s.NotificationLoading aria-label="알림을 불러오는 중">
                  {[0, 1, 2].map((item) => (
                    <div key={item}>
                      <span />
                      <span />
                    </div>
                  ))}
                </s.NotificationLoading>
              ) : notiListQ.isError ? (
                <s.MenuEmpty>
                  <PiBellSimpleThin aria-hidden="true" />
                  <strong>알림을 불러오지 못했습니다</strong>
                  <span>잠시 후 다시 시도해 주세요.</span>
                  <button type="button" onClick={() => notiListQ.refetch()}>
                    다시 시도
                  </button>
                </s.MenuEmpty>
              ) : notifications.length === 0 ? (
                <s.MenuEmpty>
                  <PiBellSimpleThin aria-hidden="true" />
                  <strong>아직 도착한 알림이 없습니다</strong>
                  <span>예약 진행 상황과 리뷰 소식을 이곳에서 알려드릴게요.</span>
                </s.MenuEmpty>
              ) : (
                <s.NotificationList>
                  {notifications.slice(0, 8).map((n) => (
                    <s.NotificationButton
                      key={n.notificationId}
                      type="button"
                      onClick={() => goByNoti(n)}
                      data-unread={!n.isRead}
                    >
                      <s.NotificationStatus aria-hidden="true" />
                      <s.NotiItem>
                        <s.NotificationMeta>
                          <strong>{n.title}</strong>
                          <time dateTime={n.createDt}>
                            {formatNotificationTime(n.createDt)}
                          </time>
                        </s.NotificationMeta>
                        <p>{n.content}</p>
                      </s.NotiItem>
                    </s.NotificationButton>
                  ))}
                </s.NotificationList>
              )}

              {!notiListQ.isPending &&
                !notiListQ.isError &&
                notifications.length > 0 && (
                  <s.NotificationFooter>
                    알림을 누르면 관련 화면으로 이동해요
                  </s.NotificationFooter>
                )}
            </Menu>

            {/* 프로필 */}
            <s.ProfileBtn
              ref={profileMenu.anchorRef}
              onClick={profileMenu.onOpen}
              aria-label="내 계정 메뉴"
              aria-haspopup="menu"
              aria-expanded={profileMenu.open}
            >
              <Avatar
                src={principal.profileImgUrl ?? undefined}
                alt={principal.username ?? undefined}
                sx={{ width: 28, height: 28, fontSize: 14 }}
              >
                {principal?.username?.[0] ?? "U"}
              </Avatar>
              <span css={dropdownCaret(profileMenu.open)} aria-hidden="true" />
            </s.ProfileBtn>

            {/* 프로필 드롭다운 메뉴 - 다른 드롭다운과 같은 모양 (dropdownStyles.dropdownMenu 값) */}
            <Menu
              anchorEl={profileMenu.anchorEl}
              disableScrollLock
              open={profileMenu.open}
              onClose={profileMenu.onClose}
              // 화면 오른쪽 끝 버튼이라 메뉴 오른쪽을 버튼 오른쪽에 맞춤
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{ paper: { sx: s.profileMenuPaperSx } }}
            >
              {/* 누가 로그인했는지 (메뉴 항목 아님) */}
              <li css={s.profileMenuHeader} role="presentation">
                <Avatar
                  src={principal.profileImgUrl ?? undefined}
                  alt=""
                  sx={{ width: 40, height: 40, fontSize: 16 }}
                >
                  {principal.username?.[0] ?? "U"}
                </Avatar>
                <div css={s.profileMenuWho}>
                  <div css={s.profileMenuNameRow}>
                    <strong>{principal.username}</strong>
                    {principal.artistStatus === "APPROVED" && <span css={s.profileMenuBadge}>아티스트</span>}
                  </div>
                  <span css={s.profileMenuEmail}>{principal.email}</span>
                </div>
              </li>
              <Divider sx={{ my: "6px !important" }} />
              <MenuItem onClick={() => goFromProfile("/mypage")}>마이페이지</MenuItem>
              <MenuItem onClick={() => goFromProfile("/mypage/reservations")}>내 예약</MenuItem>
              {artistMenuItems.map((item) => (
                <MenuItem key={item.path} onClick={() => goFromProfile(item.path)}>
                  {item.label}
                </MenuItem>
              ))}
              <MenuItem onClick={() => goFromProfile("/mypage/chats")}>채팅</MenuItem>
              <MenuItem onClick={() => goFromProfile("/mypage/inquiries")}>문의</MenuItem>
              <MenuItem onClick={() => goFromProfile("/mypage/reviews")}>리뷰 관리</MenuItem>
              <MenuItem onClick={() => goFromProfile("/mypage/follows")}>팔로잉</MenuItem>
              <MenuItem onClick={() => goFromProfile("/mypage/account")}>계정 설정</MenuItem>
              {isAdmin && <Divider sx={{ my: "6px !important" }} />}
              {isAdmin && <MenuItem onClick={() => goFromProfile("/admin")}>관리자 페이지로 전환</MenuItem>}
              <Divider sx={{ my: "6px !important" }} />
              <MenuItem
                onClick={() => {
                  profileMenu.onClose();
                  onLogout();
                }}
                sx={{ color: "#6b7280" }}
              >
                로그아웃
              </MenuItem>
            </Menu>
          </>
        ) : (
          <s.Btn onClick={() => navigate("/signin")}>로그인</s.Btn>
        )}
      </s.Right>
    </s.Header>
  );
}

export default NavBar;
