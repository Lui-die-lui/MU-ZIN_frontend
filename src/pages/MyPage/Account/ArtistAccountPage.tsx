/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import ProfileSection from "./ArtistAccount/ProfileSection/ProfileSection";
import InstrumentSection from "./ArtistAccount/InstrumentSection/InstrumentSection";
import LessonStyleSection from "./ArtistAccount/LessonStyleSection/LessonStyleSection";

function ArtistAccountPage() {
  return (
    <div css={s.page}>
      <div css={s.header}>
        <h1 css={s.title}>아티스트 프로필</h1>
        <p css={s.desc}>소개, 악기, 레슨 스타일과 활동 지역을 관리하세요.</p>
      </div>

      <div css={s.card}>
        <ProfileSection />
        <InstrumentSection />
        <LessonStyleSection />
      </div>
    </div>
  );
}

export default ArtistAccountPage;
