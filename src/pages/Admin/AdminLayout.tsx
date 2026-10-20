/** @jsxImportSource @emotion/react */
import { Outlet, useNavigate } from "react-router-dom";
import * as layout from "../MyPage/styles";
import * as s from "../MyPage/SideNavBar/styles";
import { usePendingApplicationCount } from "../../hooks/admin/useAdmin";
import NavBar from "../../components/layout/NavBar/NavBar";

// 관리자 페이지 틀 - 마이페이지와 같은 모양, 메뉴는 관리 기능만
function AdminLayout() {
  const navigate = useNavigate();
  const { data: pending = 0 } = usePendingApplicationCount(true);

  return (
    <>
      <NavBar />
      <layout.Wrap>
        <s.Aside aria-label="관리자 메뉴">
          <s.Title onClick={() => navigate("/admin")}>관리자</s.Title>

          <s.Nav>
            <s.Item>
              <s.LinkItem to="/admin/artist-applications">
                <span>아티스트 심사</span>
                {pending > 0 && (
                  <s.Badge aria-label={`심사 대기 ${pending}건`}>
                    {pending}
                  </s.Badge>
                )}
              </s.LinkItem>
            </s.Item>
            <s.Item>
              <s.LinkItem to="/admin/users">
                <span>회원 관리</span>
              </s.LinkItem>
            </s.Item>
          </s.Nav>

          <s.SwitchButton type="button" onClick={() => navigate("/mypage")}>
            사용자 화면으로 전환
          </s.SwitchButton>
        </s.Aside>
        <layout.Content>
          <Outlet />
        </layout.Content>
      </layout.Wrap>
    </>
  );
}

export default AdminLayout;
