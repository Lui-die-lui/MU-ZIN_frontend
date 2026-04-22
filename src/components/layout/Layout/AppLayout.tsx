/** @jsxImportSource @emotion/react */
import { Outlet } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import * as s from "./styles";

function Layout() {
  return (
    <s.Wrap>
      <NavBar />
      <s.Main>
        <Outlet />
      </s.Main>
    </s.Wrap>
  );
}

export default Layout;
