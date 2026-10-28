import { Route, Routes } from "react-router-dom";
import AppLayout from "../components/layout/Layout/AppLayout";
import Home from "../pages/Home/Home";
import Signin from "../pages/Auth/Signin/Signin";
import Signup from "../pages/Auth/Signup/Signup";
import MyPageRouter from "./MyPageRouter";
import AdminRouter from "./AdminRouter";
import OAuth2Redirect from "../pages/Auth/OAuth2Redirect/OAuth2Redirect";
import LessonRouter from "./LessonRouter";
import ArtistRouter from "./ArtistRouter";
import MailVerifyResult from "../pages/Auth/MailVerifyResult/MailVerifyResult";
import NotFound from "../pages/NotFound/NotFound";
import HobbyFinderPage from "../pages/HobbyFinder/HobbyFinderPage";
import AssistantPage from "../pages/Assistant/AssistantPage";
import LegalPage from "../pages/Legal/LegalPage";
import ConsentPage from "../pages/Auth/Consent/ConsentPage";

function MainRouter() {
  return (
    <Routes>
      <Route path="/mypage/*" element={<MyPageRouter />} />
      <Route path="/admin/*" element={<AdminRouter />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        {/* 나와 어울리는 음악 취미 찾기 (로그인 없이) */}
        <Route path="/hobby-finder" element={<HobbyFinderPage />} />
        {/* AI 레슨 내비게이터 (로그인 필요 - 비로그인은 화면 안에서 로그인 안내) */}
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        <Route path="/lessons/*" element={<LessonRouter />} />
        <Route path="/artists/*" element={<ArtistRouter />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mail/verify-result" element={<MailVerifyResult />} />
        {/* 이용약관 · 개인정보 처리방침 (로그인 없이) / 가입 동의 (소셜 첫 가입, 약관이 바뀐 기존 회원) */}
        <Route path="/terms" element={<LegalPage kind="terms" />} />
        <Route path="/privacy" element={<LegalPage kind="privacy" />} />
        <Route path="/consent" element={<ConsentPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default MainRouter;
