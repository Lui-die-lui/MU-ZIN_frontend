import { Route, Routes } from "react-router-dom";
import AppLayout from "../components/layout/Layout/AppLayout";
import Home from "../pages/Home/Home";
import Signin from "../pages/Auth/Signin/Signin";
import Signup from "../pages/Auth/Signup/Signup";
import MyPageRouter from "./MyPageRouter";
import OAuth2Redirect from "../pages/Auth/OAuth2Redirect/OAuth2Redirect";
import LessonRouter from "./LessonRouter";
import ArtistRouter from "./ArtistRouter";
import MailVerifyResult from "../pages/Auth/MailVerifyResult/MailVerifyResult";
import NotFound from "../pages/NotFound/NotFound";
import HobbyFinderPage from "../pages/HobbyFinder/HobbyFinderPage";

function MainRouter() {
  return (
    <Routes>
      <Route path="/mypage/*" element={<MyPageRouter />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        {/* 나와 어울리는 음악 취미 찾기 (로그인 없이) */}
        <Route path="/hobby-finder" element={<HobbyFinderPage />} />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        <Route path="/lessons/*" element={<LessonRouter />} />
        <Route path="/artists/*" element={<ArtistRouter />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mail/verify-result" element={<MailVerifyResult />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default MainRouter;
