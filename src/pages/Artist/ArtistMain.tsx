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
import SearchHero from "../../components/search/SearchHero";
import * as ui from "../../components/search/searchStyles";
import * as s from "./styles";
import { usePrincipalState } from "../../stores/usePrincipalState";

// 아티스트 찾기 - 조건은 주소(?keyword=...)에 두어 뒤로 가기·공유에도 그대로
// 들어오자마자 전체 아티스트를 보여줌 (예전: 검색 버튼을 눌러야 목록이 나옴)
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

  const viewerUserId = usePrincipalState((st) => st.principal?.userId ?? null);
  // 팔로우한 아티스트만 (로그인했을 때만)
  const followedOnly = !!viewerUserId && searchParams.get("followed") === "true";
  const toggleFollowedOnly = () => {
    const next = new URLSearchParams(searchParams);
    if (followedOnly) next.delete("followed");
    else next.set("followed", "true");
    setSearchParams(next);
  };
  const {
    data: artistPages,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useArtistSearch(applied, true, followedOnly, viewerUserId);
  const artistList = useMemo(
    () => artistPages?.pages.flatMap((page) => page) ?? [],
    [artistPages],
  );
  const isInitialLoading = isPending;
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  const loadMoreRef = useInfiniteScroll({
    enabled: !!hasNextPage && !isFetchingNextPage && !isError,
    onLoadMore: loadMore,
  });

  const handleSearch = (draft: ArtistSearchDraft) => {
    const query = makeArtistSearchParams(draft);
    const params = new URLSearchParams();
    if (query.keyword) params.set("keyword", query.keyword);
    if (query.instCategory) params.set("instCategory", query.instCategory);
    if (query.region1DepthName) params.set("region1DepthName", query.region1DepthName);
    if (query.region2DepthName) params.set("region2DepthName", query.region2DepthName);
    if (query.region3DepthName) params.set("region3DepthName", query.region3DepthName);
    query.styleTagIds?.forEach((id) => params.append("styleTagIds", String(id)));
    query.instIds?.forEach((id) => params.append("instIds", String(id)));
    if (followedOnly) params.set("followed", "true"); // 검색 조건을 바꿔도 팔로우 필터는 유지
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
    followedOnly,
  ].filter(Boolean).length;

  // 예전 주소(?searched=true)는 검색 조건이 아니므로 다시 그릴 때 기준에서 뺌
  const searchKey = (() => {
    const p = new URLSearchParams(searchParams);
    p.delete("searched");
    p.delete("followed");
    return p.toString();
  })();

  return (
    <main css={ui.page}>
      <SearchHero
        eyebrow="ARTIST SEARCH"
        title="나와 잘 맞는 아티스트 찾기"
        desc="전공과 악기, 레슨 스타일과 활동 지역을 기준으로 찾아보세요."
      >
        <ArtistSearch
          key={searchKey}
          initialValue={applied}
          onSearch={handleSearch}
          onReset={handleReset}
          resetKey={regionResetKey}
          isSearching={isInitialLoading}
          followed={viewerUserId ? { on: followedOnly, onToggle: toggleFollowedOnly } : null}
        />
      </SearchHero>

      <section css={ui.results} aria-live="polite">
        <div css={ui.resultHead}>
          <h2 css={ui.resultTitle}>
            {followedOnly ? "팔로우한 아티스트" : "아티스트"}
            {!isInitialLoading && !isError && <span>{artistList.length}{hasNextPage ? "+" : ""}명</span>}
          </h2>
          {appliedFilterCount > 0 && (
            <div css={ui.resultTools}>
              <span>{appliedFilterCount}개 조건 적용</span>
              <button type="button" css={ui.textButton} onClick={handleReset}>조건 지우기</button>
            </div>
          )}
        </div>

        {isError ? (
          <div css={ui.emptyState}>
            <strong>{getErrorMessage(error, "검색 중 오류가 발생했어요.")}</strong>
            <button type="button" css={ui.primaryButton} onClick={() => refetch()}>다시 시도</button>
          </div>
        ) : isInitialLoading ? (
          <div css={s.skeletonGrid} aria-busy="true" aria-label="아티스트를 찾고 있어요">
            {Array.from({ length: 6 }, (_, i) => <span key={i} css={[ui.skeleton, s.cardSkeleton]} />)}
          </div>
        ) : artistList.length === 0 ? (
          <div css={ui.emptyState}>
            {followedOnly ? (
              <>
                <strong>조건에 맞는 팔로우한 아티스트가 없어요.</strong>
                <span>아티스트 카드나 프로필의 하트를 눌러 팔로우해보세요.</span>
              </>
            ) : (
              <>
                <strong>조건에 맞는 아티스트가 없어요.</strong>
                <span>악기군이나 지역 조건을 조금 넓혀보세요.</span>
              </>
            )}
          </div>
        ) : (
          <>
            <div css={ui.listBusy} aria-busy={isFetchingNextPage}>
              <ArtistList artists={artistList} />
            </div>
            <div ref={loadMoreRef} css={ui.loadMore} aria-live="polite">
              {isFetchingNextPage
                ? "다음 아티스트를 불러오는 중..."
                : hasNextPage
                  ? "스크롤하면 더 불러와요"
                  : "모든 아티스트를 확인했어요."}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default ArtistMain;
