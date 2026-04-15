/** @jsxImportSource @emotion/react */
import { useEffect, useMemo, useState } from "react";
import * as s from "./styles";
import ArtistSearch from "./ArtistSearch/ArtistSearch";
import {
  DEFAULT_ARTIST_SEARCH_DRAFT,
  type ArtistSearchDraft,
} from "../../Types/artistSearchTypes";
import { useArtistSearch } from "../../hooks/artistSearch/useArtistSearch";
import ArtistList from "./ArtistList/ArtistList";
import { useSearchParams } from "react-router-dom";
import { makeArtistSearchParams } from "../../utils/artistSearchUtils";

function ArtistMain() {
  // 뒤로가기 버튼 누를 시 검색 정보 그대로 유지를 위해 사용
  const [searchParams, setSearchParams] = useSearchParams();

  // 현재 지역만 따로 연결하면서 리셋이 안먹음
  const [regionResetKey, setRegionResetKey] = useState(0);

  const searchParamsKey = searchParams.toString();

  // 실제 검색에 반영된 값
  // applied를 state에 저장하지 않고 URL에서 읽어서 계산 - 진짜 적용된 검색조건 = URL
  const applied: ArtistSearchDraft = useMemo(() => {
    return {
      keyword: searchParams.get("keyword") ?? "",
      instCategory:
        (searchParams.get(
          "instCategory",
        ) as ArtistSearchDraft["instCategory"]) ?? "ALL",
      // URL에서 꺼내면 string이라 타입 맞춰줘야함
      styleTagIds: searchParams
        .getAll("styleTagIds")
        .map(Number)
        // Number 필터링 하는데 숫자가 아닌 값이 오면 안되기 때문에
        // 숫자로 변환 가능한 값만 계산
        .filter((id) => !Number.isNaN(id)),
      instIds: searchParams
        .getAll("instIds")
        .map(Number)
        .filter((id) => !Number.isNaN(id)),
      region1DepthName: searchParams.get("region1DepthName") ?? "",
      region2DepthName: searchParams.get("region2DepthName") ?? "",
      region3DepthName: searchParams.get("region3DepthName") ?? "",
    };
    // searchParams 가 바뀔 대만 applied를 계산
  }, [searchParamsKey]);

  // 사용자가 조작중인 임시 값
  const [draft, setDraft] = useState<ArtistSearchDraft>(
    DEFAULT_ARTIST_SEARCH_DRAFT,
  );

  useEffect(() => {
    setDraft(applied);
  }, [applied]);

  // 파라미터가 하나라도 존재하는가
  // const hasSearched =
  //   searchParams.has("keyword") ||
  //   searchParams.has("instCategory") ||
  //   searchParams.has("styleTagIds") ||
  //   searchParams.has("instIds");

  // 사용자가 검색 버튼을 눌러 searched=true를 URL에 남겼나
  const hasSearched = searchParams.get("searched") === "true";

  const {
    data: artistList = [],
    isLoading,
    isError,
  } = useArtistSearch(applied, hasSearched);

  const handleSearch = () => {
    const query = makeArtistSearchParams(draft);
    // 검색 조건이 전부 상태값에 의존하고 있어서 URL query string으로 바꿈
    const params = new URLSearchParams();

    params.set("searched", "true");

    if (query.keyword) {
      params.set("keyword", draft.keyword.trim());
    }

    if (query.instCategory) {
      params.set("instCategory", draft.instCategory);
    }

    if (query.region1DepthName) {
      params.set("region1DepthName", draft.region1DepthName);
    }

    if (query.region2DepthName) {
      params.set("region2DepthName", draft.region2DepthName);
    }

    if (query.region3DepthName) {
      params.set("region3DepthName", draft.region3DepthName);
    }

    query.styleTagIds?.forEach((id) => {
      params.append("styleTagIds", String(id));
    });

    query.instIds?.forEach((id) => {
      params.append("instIds", String(id));
    });

    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchParams({});
    setRegionResetKey((prev) => prev + 1);
  };

  return (
    <div css={s.page}>
      <ArtistSearch
        draft={draft}
        onChangeDraft={setDraft}
        onSearch={handleSearch}
        onReset={handleReset}
        resetKey={regionResetKey}
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
