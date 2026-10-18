/** @jsxImportSource @emotion/react */
import { Link } from "react-router-dom";
import * as s from "../Reviews/styles";
import * as r from "../../../components/review/styles";
import * as f from "./styles";
import * as list from "../../Artist/ArtistList/styles";
import ArtistCard from "../../Artist/ArtistList/ArtistCard/ArtistCard";
import { useMyFollowings } from "../../../hooks/artistSearch/useArtistFollow";

// 마이페이지 > 팔로잉 (즐겨찾기처럼 사용)
// 내가 팔로우한 아티스트 목록은 나만 볼 수 있음 (다른 사람에게는 아티스트의 팔로워 수만 보임)
function MyFollowsPage() {
  const q = useMyFollowings();

  return (
    <div css={s.page}>
      <div css={s.header}>
        <h1 css={s.title}>팔로잉{q.data?.length ? <span css={f.count}>{q.data.length}</span> : null}</h1>
        <p css={s.desc}>팔로우한 아티스트를 모아봤어요. 내가 누구를 팔로우하는지는 다른 사람에게 보이지 않아요.</p>
      </div>

      {q.isLoading ? (
        <div css={r.stateBox}>불러오는 중...</div>
      ) : q.isError ? (
        <div css={r.stateBox}>
          목록을 불러오지 못했어요.
          <button type="button" css={r.textButton} onClick={() => q.refetch()}>
            다시 불러오기
          </button>
        </div>
      ) : !q.data?.length ? (
        <div css={r.stateBox}>
          아직 팔로우한 아티스트가 없어요.
          <span>마음에 드는 아티스트의 하트를 누르면 여기에 모여요.</span>
          <Link to="/artists" css={r.textButton}>
            아티스트 찾아보기
          </Link>
        </div>
      ) : (
        <div css={list.list}>
          {q.data.map((artist) => (
            <ArtistCard key={artist.artistProfileId} artist={artist} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyFollowsPage;
