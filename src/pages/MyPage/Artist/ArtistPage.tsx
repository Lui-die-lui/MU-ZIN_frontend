import React from "react";
import { usePrincipalState } from "../../../stores/usePrincipalState";
import type { ArtistStatus } from "../../../Types/auth";
import ArtistManagePage from "./ArtistManage/ArtistManagePage";
import ArtistApplyPage from "./ArtistApply/ArtistApplyPage";

// 아티스트 / 유저 분기 시켜줌
function ArtistPage() {
  const { principal } = usePrincipalState();
  const artistStatus = (principal?.artistStatus ?? "NONE") as ArtistStatus;

  if (artistStatus === "APPROVED") return <ArtistManagePage />;
  return <ArtistApplyPage 
//   status={artistStatus} - 이후 로직 있을 때 
  />;
}

export default ArtistPage;
