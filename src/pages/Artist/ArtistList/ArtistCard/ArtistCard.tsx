/** @jsxImportSource @emotion/react */
import { useNavigate } from "react-router-dom";
import type { ArtistSearchResp } from "../../../../Types/artistSearchTypes";
import ProfileAvatar from "../../../../components/common/ProfileAvatar/ProfileAvatar";
import {
  formatArtistMainRegion,
  formatArtistServiceRegions,
} from "../../../../utils/artistSearchUtils";
import * as s from "./styles";

type Props = {
  artist: ArtistSearchResp;
};

function ArtistCard({ artist }: Props) {
  const navigate = useNavigate();

  const handleClickCard = () => {
    navigate(`/artists/${artist.artistProfileId}`);
  };

  const mainRegion = formatArtistMainRegion(artist.mainRegion);
  const serviceRegions = formatArtistServiceRegions(artist.serviceRegions);

  return (
    <button type="button" css={s.card} onClick={handleClickCard}>
      <ProfileAvatar src={artist.profileImgUrl} name={artist.username} alt={`${artist.username} 프로필`} size={72} />

      <div css={s.content}>
        <div css={s.topRow}>
          <h3 css={s.username}>{artist.username}</h3>
          {artist.majorName && <span css={s.major}>{artist.majorName}</span>}
        </div>

        <div css={s.chips}>
          {artist.instruments.map((inst) => (
            <span key={inst.instId} css={s.chip}>
              {inst.instName}
            </span>
          ))}
        </div>
        {(mainRegion || serviceRegions) && (
          <div css={s.regions}>
            {mainRegion && <span>주 활동 지역 · {mainRegion}</span>}
            {serviceRegions && <span>레슨 가능 · {serviceRegions}</span>}
          </div>
        )}
      </div>
      <span css={s.arrow} aria-hidden="true">→</span>
    </button>
  );
}

export default ArtistCard;
