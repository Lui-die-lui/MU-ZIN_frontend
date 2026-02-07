/** @jsxImportSource @emotion/react */
import * as s from "./styles";

import { PiBellSimpleThin } from "react-icons/pi";
import { IoChevronDown } from "react-icons/io5";

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
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";

function NavBar() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { principal } = usePrincipalState();
  const logout = usePrincipalState((s) => s.logout);

  const navItems = [
    // { path: "/", label: "홈" },
    { path: "/lessons", label: "레슨" },
    { path: "/artist", label: "아티스트" },
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
    queryFn: getMyNotificationsReq,
    enabled: !!principal && notiMenu.open,
    select: (resp) => resp.data.data ?? 0,
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

  // 예약 관리로 일단 보냄
  // 나중에 refType / refId 로 switch 해서 분기 나누기
  const goByNoti = (n: NotificationResponse) => {
    navigate("/mypage/reservations");
    if (!n.isRead) markReadM.mutate(n.notificationId);
    notiMenu.onClose();
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
            <s.IconBtn onClick={notiMenu.onOpen} aria-label="notifications">
              <PiBellSimpleThin />
              {unread > 0 && <s.Badge>{unread > 99 ? "99+" : unread}</s.Badge>}
            </s.IconBtn>

            <Menu
              anchorEl={notiMenu.anchorEl}
              open={notiMenu.open}
              onClose={notiMenu.onClose}
              slotProps={{
                paper: { sx: { borderRadius: 2, minWidth: 320 } },
              }}
            >
              <s.MenuHeader>
                <span>알림</span>
                <button
                  type="button"
                  onClick={() => markAllReadM.mutate()}
                  disabled={markAllReadM.isPending}
                >
                  모두 읽음
                </button>
              </s.MenuHeader>
              <Divider />

              {notiListQ.isLoading ? (
                <s.MenuEmpty>불러오는 중...</s.MenuEmpty>
              ) : (notiListQ.data?.length ?? 0) === 0 ? (
                <s.MenuEmpty>알림이 없습니다.</s.MenuEmpty>
              ) : (
                notiListQ.data!.slice(0, 8).map((n) => (
                  <MenuItem key={n.notificationId} onClick={() => goByNoti(n)}>
                    <s.NotiItem>
                      <div>
                        <b>{n.title}</b>
                        <div>{n.content}</div>
                      </div>
                      {!n.isRead && <s.Dot />}
                    </s.NotiItem>
                  </MenuItem>
                ))
              )}
              <Divider />
              <MenuItem
                onClick={() => {
                  // navigate("/mypage/notifications"); // 아직 안만듦 알림 전체보기
                  notiMenu.onClose();
                }}
              >
                전체 보기
              </MenuItem>
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
              <IoChevronDown css={s.chevron(profileMenu.open)} />
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
              <MenuItem onClick={() => navigate("/mypage/reservations")}>
                내 일정
              </MenuItem>
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
