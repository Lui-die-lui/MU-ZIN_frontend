/** @jsxImportSource @emotion/react */
import * as s from "./styles";

import { PiBellSimpleThin } from "react-icons/pi";
import { dropdownCaret } from "../../common/dropdownStyles";

import { NavLink, useNavigate } from "react-router-dom";
import { usePrincipalState } from "../../../stores/usePrincipalState";
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
  const profileMenu = useMenuAnchor<HTMLButtonElement>();

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
  const notifications = notiListQ.data ?? [];

  // 예약 관리로 일단 보냄
  // 나중에 refType / refId 로 switch 해서 분기 나누기
  const goByNoti = (n: NotificationResponse) => {
    navigate("/mypage/reservations");
    if (!n.isRead) markReadM.mutate(n.notificationId);
    notiMenu.onClose();
  };

  // 내 일정 버튼 분기
  const goSchedule = () => {
    const isApprovedArtist = principal?.artistStatus === "APPROVED";

    navigate(
      isApprovedArtist
        ? "/mypage/reservations/requests?tab=all"
        : "/mypage/reservations?tab=all",
    );

    profileMenu.onClose();
  };
  
  return (
    <s.Header>
      <s.Left>
        <s.Logo onClick={() => navigate("/")}>MU:ZIN</s.Logo>

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
            <s.Btn onClick={() => navigate("/mypage/reservations")}>일정</s.Btn>
            {/* <s.Btn onClick={onLogout}>로그아웃</s.Btn> */}

            {/* 알림 */}
            <s.IconBtn
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
                  <span>예약 진행 상황을 이곳에서 알려드릴게요.</span>
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
                    알림을 누르면 관련 일정으로 이동합니다
                  </s.NotificationFooter>
                )}
            </Menu>

            {/* 프로필 */}
            <s.ProfileBtn
              onClick={profileMenu.onOpen}
              aria-label="profile-menu"
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

            {/* 프로필 드롭다운 메뉴 */}
            <Menu
              anchorEl={profileMenu.anchorEl}
              open={profileMenu.open}
              onClose={profileMenu.onClose}
              slotProps={{
                paper: { sx: { borderRadius: 2, minWidth: 180 } },
              }}
            >
              <MenuItem onClick={() => navigate("/mypage")}>
                마이페이지
              </MenuItem>
              <MenuItem onClick={goSchedule}>내 일정</MenuItem>
              <MenuItem onClick={onLogout}>로그아웃</MenuItem>
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
