import React from "react";
import ProfileSection from "./ArtistAccount/ProfileSection/ProfileSection";
import InstrumentSection from "./ArtistAccount/InstrumentSection/InstrumentSection";
import LessonStyleSection from "./ArtistAccount/LessonStyleSection/LessonStyleSection";

function ArtistAccountPage() {
  return (
    <div>
      <ProfileSection />
      <InstrumentSection />
      <LessonStyleSection />
    </div>
  );
}

export default ArtistAccountPage;
