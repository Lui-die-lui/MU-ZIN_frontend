/** @jsxImportSource @emotion/react */
import { useNavigate } from "react-router-dom";
import type { ArtistSearchResp } from "../../../../Types/artistSearchTypes";
import ProfileAvatar from "../../../../components/common/ProfileAvatar/ProfileAvatar";
import {
  formatArtistMainRegion,
  formatArtistServiceRegions,
} from "../../../../utils/artistSearchUtils";
import * as s from "./styles";
import FollowButton from "../../../../components/artist/FollowButton";

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
    // 팔로우 버튼은 카드 버튼 안에 넣을 수 없어(버튼 안 버튼) 옆에 겹쳐 둠
    <div css={s.cardWrap}>
      <button type="button" css={s.card} onClick={handleClickCard}>
        <ProfileAvatar
          src={artist.profileImgUrl}
          name={artist.username}
          alt={`${artist.username} 프로필`}
          size={56}
        />

        <div css={s.content}>
          <div css={s.topRow}>
            <h3 css={s.username}>{artist.username}</h3>
            <span css={s.sub2}>
              {artist.majorName ? `${artist.majorName} · ` : ""}팔로워 {artist.followerCount.toLocaleString("ko-KR")}
            </span>
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
      </button>
      <div css={s.follow}>
        <FollowButton
        key={String(artist.followedByMe)}
        size="sm"
        artistProfileId={artist.artistProfileId}
        artistName={artist.username}
        profileImgUrl={artist.profileImgUrl}
        following={artist.followedByMe}
      />
      </div>
    </div>
  );
}

export default ArtistCard;
