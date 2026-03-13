/** @jsxImportSource @emotion/react */
import type { ArtistSearchResp } from "../../../Types/artistSearchTypes";
import ArtistCard from "./ArtistCard/ArtistCard";
import * as s from "./styles";

type Props = {
  artists: ArtistSearchResp[];
};
function ArtistList({ artists }: Props) {
  if (artists.length === 0) {
    return <div css={s.empty}>검색 결과가 없습니다.</div>;
  }

  return (
    <div css={s.list}>
      {artists.map((artist) => (
        <ArtistCard key={artist.artistProfileId} artist={artist} />
      ))}
    </div>
  );
}

export default ArtistList;
