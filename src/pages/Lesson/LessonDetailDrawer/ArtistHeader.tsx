/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import ProfileAvatar from "../../../components/common/ProfileAvatar/ProfileAvatar";
import { useNavigate } from "react-router-dom";

type Artist = {
  artistProfileId: number;
  username: string;
  profileImgUrl: string | null; // null 허용 - 이미지 없을 수도 있으니까
  // 나중에 carrer/majorame 등 추가 가능
};

type Props = {
  artist: Artist;
};
function ArtistHeader({ artist }: Props) {
  const navigate = useNavigate();

  const onClickDetail = () => {
    navigate(`/artists/${artist.artistProfileId}`);
  };

  return (
    <button type="button" css={s.artistHeader} onClick={onClickDetail}>
      <ProfileAvatar
        src={artist.profileImgUrl ?? null}
        name={artist.username}
        alt={`${artist.username} 프로필`}
        size={44}
      />

      <div css={s.artistMeta}>
        <div css={s.artistName}>{artist.username}</div>
      </div>
    </button>
  );
}

export default ArtistHeader;
