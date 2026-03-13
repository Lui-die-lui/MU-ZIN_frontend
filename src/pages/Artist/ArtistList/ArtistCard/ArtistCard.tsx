/** @jsxImportSource @emotion/react */
import type { ArtistSearchResp } from "../../../../Types/artistSearchTypes";
import * as s from "./styles";

type Props = {
  artist: ArtistSearchResp;
};

function ArtistCard({ artist }: Props) {
  return (
     <article css={s.card}>
      <img
        css={s.image}
        src={artist.profileImgUrl || "/default-profile.png"}
        alt={artist.username}
      />

      <div css={s.content}>
        <div css={s.topRow}>
          <h3 css={s.username}>{artist.username}</h3>
          <span css={s.major}>{artist.majorName}</span>
        </div>

        <div css={s.chips}>
          {artist.instruments.map((inst) => (
            <span key={inst.instId} css={s.chip}>
              {inst.instName}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default ArtistCard;
