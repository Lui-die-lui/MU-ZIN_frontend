import React from "react";
import ArtistProfileSection from "./ArtistProfileSection/ArtistProfileSection";
import { useParams } from "react-router-dom";
import { useArtistProfileDetail } from "../../../hooks/artistSearch/useArtistSearch";
import ArtistLessonSection from "./ArtistLessonSection/ArtistLessonSection";

function ArtistDetail() {
  const { artistProfileId } = useParams();
  const numericArtistProfileId = Number(artistProfileId);

  const { data, isLoading, isError } = useArtistProfileDetail(
    numericArtistProfileId,
  );

  if (!artistProfileId || Number.isNaN(numericArtistProfileId)) {
    return <div>잘못된 접근입니다.</div>;
  }

  if (isLoading) return <div>로딩중...</div>;

  if (isError || !data) return <div>불러오기 실패</div>;

  return (
    <>
      <ArtistProfileSection artist={data} />
      <ArtistLessonSection artistProfileId={numericArtistProfileId}/>
    </>
  );
}

export default ArtistDetail;
