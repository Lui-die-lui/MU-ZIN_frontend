/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useArtistLessonCards, useArtistProfileDetail } from "../../../hooks/artistSearch/useArtistSearch";
import { usePrincipalState } from "../../../stores/usePrincipalState";
import ProfileAvatar from "../../../components/common/ProfileAvatar/ProfileAvatar";
import ArtistLessons from "./ArtistLessons";
import { useArtistReviews } from "../../../hooks/review/useReviews";
import ReviewSection from "../../../components/review/ReviewSection";
import { StarDisplay } from "../../../components/review/StarRating";
import FollowButton from "../../../components/artist/FollowButton";
import InquiryModal from "../../../components/chat/InquiryModal";
import { useState } from "react";
import { useArtistFollow } from "../../../hooks/artistSearch/useArtistFollow";

const regionText = (r: { region1DepthName: string | null; region2DepthName?: string | null; region3DepthName?: string | null }) =>
  [r.region1DepthName, r.region2DepthName, r.region3DepthName].filter(Boolean).join(" ");

// 공개 아티스트 프로필
// 예전: 소개·경력이 안 보이고 "레슨 스타일"이 두 번, 사진이 없으면 깨진 이미지, 레슨을 고르면 목록 아래에 상세가 날것으로 펼쳐짐
// 지금: [사진·이름·전공·스튜디오 + 악기/스타일/지역] → 소개 → 레슨(누르면 레슨 검색과 같은 상세 창) → 경력
function ArtistDetail() {
  const { artistProfileId } = useParams();
  const id = Number(artistProfileId);
  const validId = Number.isInteger(id) && id > 0;

  const navigate = useNavigate();
  const location = useLocation();
  const principal = usePrincipalState((st) => st.principal);

  // 잘못된 주소면 요청하지 않음 (훅 enabled 가 0 을 막음)
  const { data: artist, isLoading, isError } = useArtistProfileDetail(validId ? id : 0);
  const lessonsQ = useArtistLessonCards(validId ? id : 0);
  // 이 아티스트가 받은 전체 리뷰 (리뷰마다 어떤 레슨인지 표시)
  const reviewsQ = useArtistReviews(validId ? id : null);
  // 팔로워 수 + 내가 팔로우 중인지
  const followQ = useArtistFollow(validId ? id : null);
  const [inquiryOpen, setInquiryOpen] = useState(0); // 0 = 닫힘, 열 때마다 새 key

  // 목록에서 들어왔으면 뒤로, 주소로 바로 들어왔으면 아티스트 찾기로
  const goBack = () => (location.key !== "default" ? navigate(-1) : navigate("/artists"));

  if (!validId || isError || (!isLoading && !artist)) {
    return (
      <div css={s.wrap}>
        <div css={s.state} role="alert">
          <strong>아티스트를 찾을 수 없어요</strong>
          주소가 잘못됐거나, 지금은 공개되지 않은 아티스트예요.
          <Link css={s.btn("ghost")} to="/artists">
            아티스트 찾기
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !artist) {
    return (
      <div css={s.wrap} aria-busy="true">
        <div css={s.stack}>
          <div css={s.skeleton(220)} />
          <div css={s.skeleton(120)} />
          <div css={s.skeleton(180)} />
        </div>
      </div>
    );
  }

  const isOwner = principal?.userId === artist.userId;
  const lessonCount = lessonsQ.data?.length ?? 0;
  const studio = artist.mainRegion?.addressLabel
    ? [artist.mainRegion.addressLabel, artist.mainRegion.detailAddress].filter(Boolean).join(" ")
    : null;

  const scrollToLessons = () =>
    document.getElementById("artist-lessons")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const scrollToReviews = () =>
    document.getElementById("artist-reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const reviewSummary = reviewsQ.data?.summary;

  return (
    <div css={s.wrap}>
      <button type="button" css={s.backLink} onClick={goBack}>
        ← 뒤로
      </button>

      <div css={s.stack}>
        {/* 한눈에 보는 정보 */}
        <section css={s.card} aria-label="아티스트 정보">
          <div css={s.hero}>
            <ProfileAvatar src={artist.profileImgUrl} name={artist.username} alt={`${artist.username} 프로필 사진`} size={88} />

            <div>
              <div css={s.heroTop}>
                <div>
                  <div css={s.nameRow}>
                    <h1 css={s.name}>{artist.username}</h1>
                    {artist.majorName && (
                      <span css={s.majorBadge}>
                        {/* 신청 화면의 "음악 비전공이에요" 선택값 */}
                        {artist.majorName.trim() === "비전공" ? "음악 비전공" : `${artist.majorName} 전공`}
                      </span>
                    )}
                  </div>
                  {studio && (
                    <div css={s.location}>
                      <FaMapMarkerAlt size={13} aria-hidden="true" />
                      <span>{studio}</span>
                    </div>
                  )}
                  {/* 인스타처럼 숫자만 (누가 팔로우하는지 명단은 비공개) */}
                  <ul css={s.stats} aria-label="아티스트 숫자">
                    <li>
                      레슨 <strong>{lessonCount}</strong>
                    </li>
                    <li>
                      팔로워 <strong>{(followQ.data?.followerCount ?? 0).toLocaleString("ko-KR")}</strong>
                    </li>
                  </ul>
                  {reviewSummary && reviewSummary.reviewCount > 0 && (
                    <button type="button" css={s.ratingLine} onClick={scrollToReviews}>
                      <StarDisplay value={reviewSummary.averageRating} size={15} />
                      <strong>{reviewSummary.averageRating.toFixed(1)}</strong>
                      <span>리뷰 {reviewSummary.reviewCount}개</span>
                    </button>
                  )}
                </div>

                <div css={s.actions}>
                  {followQ.data && !isOwner && (
                    <FollowButton
                      key={String(followQ.data.following)}
                      artistProfileId={id}
                      artistName={artist.username}
                      profileImgUrl={artist.profileImgUrl}
                      following={followQ.data.following}
                    />
                  )}
                  {isOwner ? (
                    <>
                      <Link css={s.btn("ghost")} to="/mypage/account/artist">
                        프로필 수정
                      </Link>
                      <Link css={s.btn("ghost")} to="/mypage/artist/manage">
                        레슨 관리
                      </Link>
                    </>
                  ) : (
                    <>
                    {/* 레슨이 없어도 문의 가능 */}
                    <button
                      type="button"
                      css={s.btn("ghost")}
                      onClick={() => (principal ? setInquiryOpen((n) => n + 1) : navigate("/signin", { state: { from: location } }))}
                    >
                      문의하기
                    </button>
                    {lessonCount > 0 && (
                      <button type="button" css={s.btn("primary")} onClick={scrollToLessons}>
                        레슨 {lessonCount}개 보기
                      </button>
                    )}
                    </>
                  )}
                </div>
              </div>

              <div css={s.facts}>
                <div css={s.factRow}>
                  <span css={s.factLabel}>악기</span>
                  {artist.instruments.length > 0 ? (
                    <div css={s.chips}>
                      {artist.instruments.map((inst) => (
                        <span key={inst.instId} css={s.chip("neutral")}>
                          {inst.instName}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span css={s.emptyInline}>-</span>
                  )}
                </div>

                {artist.styleTags.length > 0 && (
                  <div css={s.factRow}>
                    <span css={s.factLabel}>레슨 스타일</span>
                    <div css={s.chips}>
                      {artist.styleTags.map((tag) => (
                        <span key={tag.lessonStyleTagId} css={s.chip("style")}>
                          {tag.styleName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {artist.serviceRegions.length > 0 && (
                  <div css={s.factRow}>
                    <span css={s.factLabel}>방문 가능 지역</span>
                    <div css={s.chips}>
                      {artist.serviceRegions.map((r) => (
                        <span key={regionText(r)} css={s.chip("region")}>
                          {regionText(r)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 소개 */}
        <section css={s.card} aria-labelledby="artist-bio-title">
          <h2 id="artist-bio-title" css={s.sectionTitle}>
            소개
          </h2>
          {artist.bio?.trim() ? <p css={s.bodyText}>{artist.bio}</p> : <p css={s.mutedText}>아직 소개를 적지 않았어요.</p>}
        </section>

        {/* 레슨 */}
        <ArtistLessons artistProfileId={id} isOwner={isOwner} query={lessonsQ} />

        {inquiryOpen > 0 && (
          <InquiryModal key={inquiryOpen} open artistProfileId={id} artistName={artist.username} onClose={() => setInquiryOpen(0)} />
        )}

        {/* 리뷰 - 모든 레슨의 리뷰 + 많이 선택된 태그 순위 */}
        <section id="artist-reviews" css={[s.card, s.reviewCard]} aria-labelledby="artist-reviews-title">
          <div css={s.reviewHeader}>
            <h2 id="artist-reviews-title" css={s.sectionTitle}>
              리뷰 {reviewSummary?.reviewCount ? <span>{reviewSummary.reviewCount}</span> : null}
            </h2>
            {isOwner && (
              <Link css={s.btn("ghost")} to="/mypage/reviews?tab=received">
                답글 관리
              </Link>
            )}
          </div>
          <ReviewSection
            data={reviewsQ.data}
            isLoading={reviewsQ.isLoading}
            isError={reviewsQ.isError}
            onRetry={() => reviewsQ.refetch()}
            showLesson
            limit={5}
            emptyText="아직 받은 리뷰가 없어요. 레슨을 받은 수강생만 리뷰를 남길 수 있어요."
          />
        </section>

        {/* 경력 (있을 때만) */}
        {artist.career?.trim() && (
          <section css={s.card} aria-labelledby="artist-career-title">
            <h2 id="artist-career-title" css={s.sectionTitle}>
              경력
            </h2>
            <p css={s.bodyText}>{artist.career}</p>
          </section>
        )}
      </div>
    </div>
  );
}

export default ArtistDetail;
