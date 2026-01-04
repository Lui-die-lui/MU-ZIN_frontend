import React from "react";
import ProfileHeaderCard from "./ProfileHeaderCard/ProfileHeaderCard";
import NotificationSummary from "./NotificationSummary/NotificationSummary";

function HomePage() {
  return (
    <div>
      <ProfileHeaderCard />
      <NotificationSummary />
    </div>
  );
}

export default HomePage;
