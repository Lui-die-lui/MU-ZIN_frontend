/** @jsxImportSource @emotion/react */
import { useState } from "react";
import * as s from "./styles";
import ArtistSearch from "./ArtistSearch/ArtistSearch";
import {
  DEFAULT_ARTIST_SEARCH_DRAFT,
  type ArtistSearchDraft,
} from "../../Types/artistSearchTypes";
import { useArtistSearch } from "../../hooks/artistSearch/useArtistSearch";
import ArtistList from "./ArtistList/ArtistList";

function ArtistMain() {
  const [draft, setDraft] = useState<ArtistSearchDraft>(
    DEFAULT_ARTIST_SEARCH_DRAFT,
  );

  const [applied, setApplied] = useState<ArtistSearchDraft>(
    DEFAULT_ARTIST_SEARCH_DRAFT,
  );

  // 자동 조회 기능 막기
  const [hasSearched, setHasSearched] = useState(false);

  const {
    data: artistList = [],
    isLoading,
    isError,
  } = useArtistSearch(applied, hasSearched);

  const handleSearch = () => {
    setApplied(draft);
    setHasSearched(true);
  };

  const handleReset = () => {
    setDraft(DEFAULT_ARTIST_SEARCH_DRAFT);
    setApplied(DEFAULT_ARTIST_SEARCH_DRAFT);
    setHasSearched(false);
  };
  return (
    <div css={s.page}>
      <ArtistSearch
        draft={draft}
        onChangeDraft={setDraft}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <div css={s.resultSection}>
        {!hasSearched && (
          <div css={s.message}>검색어 또는 조건을 입력한 뒤 검색해주세요.</div>
        )}
        {hasSearched && isLoading && <div css={s.message}>불러오는 중...</div>}
        {hasSearched && isError && (
          <div css={s.message}>검색 중 오류가 발생했습니다.</div>
        )}
        {hasSearched && !isLoading && !isError && (
          <ArtistList artists={artistList} />
        )}
      </div>
    </div>
  );
}

export default ArtistMain;
