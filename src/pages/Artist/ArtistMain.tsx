/** @jsxImportSource @emotion/react */
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { ArtistSearchDraft } from "../../Types/artistSearchTypes";
import { INSTRUMENT_CATEGORIES, type InstrumentCategory } from "../../Types/instrumentTypes";
import { useArtistSearch } from "../../hooks/artistSearch/useArtistSearch";
import { makeArtistSearchParams } from "../../utils/artistSearchUtils";
import { getErrorMessage } from "../../utils/errorUtils";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import ArtistSearch from "./ArtistSearch/ArtistSearch";
import ArtistList from "./ArtistList/ArtistList";
import * as s from "./styles";

function ArtistMain() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [regionResetKey, setRegionResetKey] = useState(0);

  const applied: ArtistSearchDraft = useMemo(() => {
    const category = searchParams.get("instCategory");
    const validCategory = INSTRUMENT_CATEGORIES.includes(category as InstrumentCategory)
      ? (category as InstrumentCategory)
      : "ALL";

    return {
      keyword: searchParams.get("keyword") ?? "",
      instCategory: validCategory,
      styleTagIds: searchParams.getAll("styleTagIds").map(Number).filter(Number.isFinite),
      instIds: searchParams.getAll("instIds").map(Number).filter(Number.isFinite),
      region1DepthName: searchParams.get("region1DepthName") ?? "",
      region2DepthName: searchParams.get("region2DepthName") ?? "",
      region3DepthName: searchParams.get("region3DepthName") ?? "",
    };
  }, [searchParams]);

  const hasSearched = searchParams.get("searched") === "true";
  const {
    data: artistPages,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useArtistSearch(applied, hasSearched);
  const artistList = useMemo(
    () => artistPages?.pages.flatMap((page) => page) ?? [],
    [artistPages],
  );
  const isInitialLoading = hasSearched && isPending;
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  const loadMoreRef = useInfiniteScroll({
    enabled: hasSearched && !!hasNextPage && !isFetchingNextPage && !isError,
    onLoadMore: loadMore,
  });

  const handleSearch = (draft: ArtistSearchDraft) => {
    const query = makeArtistSearchParams(draft);
    const params = new URLSearchParams({ searched: "true" });
    if (query.keyword) params.set("keyword", query.keyword);
    if (query.instCategory) params.set("instCategory", query.instCategory);
    if (query.region1DepthName) params.set("region1DepthName", query.region1DepthName);
    if (query.region2DepthName) params.set("region2DepthName", query.region2DepthName);
    if (query.region3DepthName) params.set("region3DepthName", query.region3DepthName);
    query.styleTagIds?.forEach((id) => params.append("styleTagIds", String(id)));
    query.instIds?.forEach((id) => params.append("instIds", String(id)));
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchParams({});
    setRegionResetKey((value) => value + 1);
  };

  const appliedFilterCount = [
    applied.keyword,
    applied.instCategory !== "ALL" ? applied.instCategory : null,
    applied.instIds.length,
    applied.styleTagIds.length,
    applied.region1DepthName,
  ].filter(Boolean).length;

  return (
    <main css={s.page}>
      <header css={s.pageHeader}>
        <span css={s.eyebrow}>ARTIST SEARCH</span>
        <h1 css={s.pageTitle}>나와 잘 맞는 아티스트 찾기</h1>
        <p css={s.pageDescription}>전공과 악기, 레슨 스타일과 활동 지역을 기준으로 찾아보세요.</p>
      </header>

      <ArtistSearch key={searchParams.toString()} initialValue={applied} onSearch={handleSearch}
        onReset={handleReset} resetKey={regionResetKey} isSearching={isInitialLoading} />

      <section css={s.resultSection} aria-live="polite">
        {!hasSearched ? (
          <div css={s.emptyState}>
            <strong>함께할 아티스트를 찾아보세요.</strong>
            <span>조건 없이 검색하면 현재 활동 중인 모든 아티스트를 볼 수 있어요.</span>
          </div>
        ) : (
          <>
            <div css={s.resultHeader}>
              <div>
                <span css={s.resultLabel}>검색 결과</span>
                <h2 css={s.resultTitle}>{isInitialLoading ? "아티스트를 찾고 있어요" : `${artistList.length}명 불러옴`}</h2>
              </div>
              {appliedFilterCount > 0 && <span css={s.filterCount}>{appliedFilterCount}개 조건 적용</span>}
            </div>
            {isError ? (
              <div css={s.emptyState}>
                <strong>{getErrorMessage(error, "검색 중 오류가 발생했어요.")}</strong>
                <button type="button" css={s.retryButton} onClick={() => refetch()}>다시 시도</button>
              </div>
            ) : isInitialLoading && artistList.length === 0 ? (
              <div css={s.loadingState}>검색 결과를 불러오는 중이에요.</div>
            ) : (
              <div css={s.resultBody} aria-busy={isFetchingNextPage}>
                <ArtistList artists={artistList} />
                <div ref={loadMoreRef} css={s.loadMore} aria-live="polite">
                  {isFetchingNextPage
                    ? "다음 아티스트를 불러오는 중..."
                    : hasNextPage
                      ? "스크롤하면 더 불러와요"
                      : artistList.length > 0
                        ? "모든 아티스트를 확인했어요."
                        : null}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default ArtistMain;
