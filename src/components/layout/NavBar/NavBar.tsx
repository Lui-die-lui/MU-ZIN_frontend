/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { usePrincipalState } from "../../../stores/usePrincipalState";

function NavBar() {
  const navigate = useNavigate();
  const { principal, logout } = usePrincipalState();

  const navItems = [
    // { path: "/", label: "홈" },
    { path: "/lessons", label: "레슨" },
  ];

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
            <s.Btn onClick={() => navigate("/mypage")}>마이페이지</s.Btn>
            <s.Btn onClick={logout}>로그아웃</s.Btn>
          </>
        ) : (
          <s.Btn onClick={() => navigate("/login")}>로그인</s.Btn>
        )}
      </s.Right>
    </s.Header>
  );
}

export default NavBar;
