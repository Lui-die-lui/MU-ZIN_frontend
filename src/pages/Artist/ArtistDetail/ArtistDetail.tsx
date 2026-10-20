/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useArtistLessonCards, useArtistProfileDetail } from "../../../hooks/artistSearch/useArtistSearch";
import { usePrincipalState } from "../../../stores/usePrincipalState";
import ProfileAvatar from "../../../components/common/ProfileAvatar/ProfileAvatar";
import ArtistLessons from "./ArtistLessons";
import { formatPrice } from "./lessonPrice";
import { useArtistReviews } from "../../../hooks/review/useReviews";
import ReviewSection from "../../../components/review/ReviewSection";
import { StarDisplay } from "../../../components/review/StarRating";
import FollowButton from "../../../components/artist/FollowButton";
import InquiryModal from "../../../components/chat/InquiryModal";
import { useEffect, useState } from "react";
import { useArtistFollow } from "../../../hooks/artistSearch/useArtistFollow";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { LESSON_MODE_LABEL } from "../../../Types/lessonTypes";

const regionText = (r: { region1DepthName: string | null; region2DepthName?: string | null; region3DepthName?: string | null }) =>
  [r.region1DepthName, r.region2DepthName, r.region3DepthName].filter(Boolean).join(" ");

type SectionId = "about" | "lessons" | "reviews";
const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "about", label: "소개" },
  { id: "lessons", label: "레슨" },
  { id: "reviews", label: "리뷰" },
];
const SECTION_DOM_ID: Record<SectionId, string> = {
  about: "artist-about",
  lessons: "artist-lessons",
  reviews: "artist-reviews",
};

// 공개 아티스트 프로필
// [사진·이름·전공·스튜디오·숫자 + 악기/스타일/지역] → [소개·레슨·리뷰 탭(따라옴)] → 소개(+경력) → 레슨 → 리뷰
// 오른쪽(좁으면 아래 고정 바) 예약 카드: 가격·방식 + 레슨 보기 · 문의하기 - 어디를 읽든 바로 다음 행동으로
function ArtistDetail() {
  const { artistProfileId } = useParams();
  const id = Number(artistProfileId);
  const validId = Number.isInteger(id) && id > 0;

  const navigate = useNavigate();
  const location = useLocation();
  const principal = usePrincipalState((st) => st.principal);
  const avatarSize = useIsMobile() ? 72 : 104;

  // 잘못된 주소면 요청하지 않음 (훅 enabled 가 0 을 막음)
  const { data: artist, isLoading, isError } = useArtistProfileDetail(validId ? id : 0);
  const lessonsQ = useArtistLessonCards(validId ? id : 0);
  // 이 아티스트가 받은 전체 리뷰 (리뷰마다 어떤 레슨인지 표시)
  const reviewsQ = useArtistReviews(validId ? id : null);
  // 팔로워 수 + 내가 팔로우 중인지
  const followQ = useArtistFollow(validId ? id : null);
  const [inquiryOpen, setInquiryOpen] = useState(0); // 0 = 닫힘, 열 때마다 새 key

  // 지금 보고 있는 섹션 (탭 표시) - 화면 위쪽 40% 안에 들어온 섹션
  const [active, setActive] = useState<SectionId>("about");
  const loaded = !!artist;
  useEffect(() => {
    if (!loaded) return;
    const els = SECTIONS.map((sec) => document.getElementById(SECTION_DOM_ID[sec.id])).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        const sec = hit && SECTIONS.find((x) => SECTION_DOM_ID[x.id] === hit.target.id);
        if (sec) setActive(sec.id);
      },
      { rootMargin: "-140px 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [loaded]);

  // 목록에서 들어왔으면 뒤로, 주소로 바로 들어왔으면 아티스트 찾기로
  const goBack = () => (location.key !== "default" ? navigate(-1) : navigate("/artists"));

  if (!validId || isError || (!isLoading && !artist)) {
    return (
      <div css={s.wrap}>
        <div css={s.state} role="alert">
          <strong>아티스트를 찾을 수 없어요</strong>
          주소가 잘못됐거나, 지금은 공개되지 않은 아티스트예요.
          <Link css={s.btn("primary")} to="/artists">
            아티스트 찾기
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !artist) {
    return (
      <div css={s.wrap} aria-busy="true">
        <div css={s.skeleton(240)} />
        <div css={s.skeleton(56)} />
        <div css={s.skeleton(320)} />
      </div>
    );
  }

  const isOwner = principal?.userId === artist.userId;
  const lessons = lessonsQ.data ?? [];
  const lessonCount = lessons.length;
  const studio = artist.mainRegion?.addressLabel
    ? [artist.mainRegion.addressLabel, artist.mainRegion.detailAddress].filter(Boolean).join(" ")
    : null;
  const reviewSummary = reviewsQ.data?.summary;
  const reviewCount = reviewSummary?.reviewCount ?? 0;

  // 예약 카드: 가장 낮은 가격 + 수업 방식
  const prices = lessons.map((l) => l.price).filter((p): p is number => p != null);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const modes = [...new Set(lessons.map((l) => LESSON_MODE_LABEL[l.mode] ?? l.mode))];

  const goSection = (sectionId: SectionId) =>
    document.getElementById(SECTION_DOM_ID[sectionId])?.scrollIntoView({ behavior: "smooth", block: "start" });
  const openInquiry = () =>
    principal ? setInquiryOpen((n) => n + 1) : navigate("/signin", { state: { from: location } });

  return (
    <div css={s.wrap}>
      <button type="button" css={s.backLink} onClick={goBack}>
        ← 뒤로
      </button>

      {/* 한눈에 보는 정보 */}
      <section css={s.hero} aria-label="아티스트 정보">
        <div css={s.avatarArea}>
          <ProfileAvatar src={artist.profileImgUrl} name={artist.username} alt={`${artist.username} 프로필 사진`} size={avatarSize} />
        </div>

        <div css={s.info}>
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
          <div css={s.numbers}>
            {/* 인스타처럼 숫자만 (누가 팔로우하는지 명단은 비공개) */}
            <ul css={s.stats} aria-label="아티스트 숫자">
              <li>
                레슨 <strong>{lessonCount}</strong>
              </li>
              <li>
                팔로워 <strong>{(followQ.data?.followerCount ?? 0).toLocaleString("ko-KR")}</strong>
              </li>
            </ul>
            {reviewSummary && reviewCount > 0 && (
              <button type="button" css={s.ratingLine} onClick={() => goSection("reviews")}>
                <StarDisplay value={reviewSummary.averageRating} size={14} />
                <strong>{reviewSummary.averageRating.toFixed(1)}</strong>
                <span>리뷰 {reviewCount}개</span>
              </button>
            )}
          </div>
        </div>

        <div css={s.actions}>
          {isOwner ? (
            <>
              <Link css={s.smallBtn} to="/mypage/account/artist">
                프로필 수정
              </Link>
              <Link css={s.smallBtn} to="/mypage/artist/manage">
                레슨 관리
              </Link>
            </>
          ) : (
            followQ.data && (
              <FollowButton
                key={String(followQ.data.following)}
                artistProfileId={id}
                artistName={artist.username}
                profileImgUrl={artist.profileImgUrl}
                following={followQ.data.following}
              />
            )
          )}
        </div>

        <div css={s.facts}>
          <div css={s.fact}>
            <span css={s.factLabel}>악기</span>
            {artist.instruments.length > 0 ? (
              <div css={s.chips}>
                {artist.instruments.map((inst) => (
                  <span key={inst.instId} css={s.chip}>
                    {inst.instName}
                  </span>
                ))}
              </div>
            ) : (
              <span css={s.emptyInline}>-</span>
            )}
          </div>
          {artist.styleTags.length > 0 && (
            <div css={s.fact}>
              <span css={s.factLabel}>레슨 스타일</span>
              <div css={s.chips}>
                {artist.styleTags.map((tag) => (
                  <span key={tag.lessonStyleTagId} css={s.chip}>
                    {tag.styleName}
                  </span>
                ))}
              </div>
            </div>
          )}
          {artist.serviceRegions.length > 0 && (
            <div css={s.fact}>
              <span css={s.factLabel}>방문 가능 지역</span>
              <div css={s.chips}>
                {artist.serviceRegions.map((r) => (
                  <span key={regionText(r)} css={s.chip}>
                    {regionText(r)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 소개 · 레슨 · 리뷰 - 따라오는 탭, 지금 보는 곳 표시 */}
      <nav css={s.tabs} aria-label="아티스트 정보 바로가기">
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            type="button"
            css={s.tab(active === sec.id)}
            aria-current={active === sec.id ? "true" : undefined}
            onClick={() => goSection(sec.id)}
          >
            {sec.label}
            {sec.id === "lessons" && lessonsQ.isSuccess && <span>{lessonCount}</span>}
            {sec.id === "reviews" && reviewCount > 0 && <span>{reviewCount}</span>}
          </button>
        ))}
      </nav>

      <div css={s.body}>
        <div css={s.main}>
          {/* 소개 + 경력 */}
          <section id={SECTION_DOM_ID.about} css={s.section} aria-labelledby="artist-bio-title">
            <h2 id="artist-bio-title" css={s.sectionTitle}>
              소개
            </h2>
            {artist.bio?.trim() ? <p css={s.bodyText}>{artist.bio}</p> : <p css={s.mutedText}>아직 소개를 적지 않았어요.</p>}
            {artist.career?.trim() && (
              <div css={s.career}>
                <h3>경력</h3>
                <p css={s.bodyText}>{artist.career}</p>
              </div>
            )}
          </section>

          {/* 레슨 */}
          <ArtistLessons artistProfileId={id} isOwner={isOwner} query={lessonsQ} />

          {/* 리뷰 - 모든 레슨의 리뷰 + 많이 선택된 태그 순위 */}
          <section id={SECTION_DOM_ID.reviews} css={s.section} aria-labelledby="artist-reviews-title">
            <div css={s.sectionHead}>
              <h2 id="artist-reviews-title" css={s.sectionTitle}>
                리뷰 {reviewCount ? <span>{reviewCount}</span> : null}
              </h2>
              {isOwner && (
                <Link css={s.textBtn} to="/mypage/reviews?tab=received">
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
        </div>

        {/* 예약 카드 - 넓으면 오른쪽에 따라옴, 좁으면 화면 아래 고정 바 (본인에게는 안 보임) */}
        {!isOwner && (
          <div css={s.bookCard} role="region" aria-label="레슨 예약">
            <div css={s.bookInfo}>
              <span css={s.bookEyebrow}>LESSON</span>
              {lessonCount > 0 ? (
                <>
                  <p css={s.bookPrice}>
                    {minPrice == null ? "가격 문의" : minPrice === 0 ? "무료" : formatPrice(minPrice)}
                    {minPrice != null && minPrice > 0 && lessonCount > 1 && <small>부터</small>}
                  </p>
                  <p css={s.bookSub}>
                    레슨 {lessonCount}개 · {modes.join(" · ")}
                  </p>
                </>
              ) : (
                <p css={s.bookSub}>지금 예약할 수 있는 레슨이 없어요.</p>
              )}
            </div>
            <div css={s.bookActions}>
              {lessonCount > 0 && (
                <button type="button" css={s.btn("primary")} onClick={() => goSection("lessons")}>
                  레슨 {lessonCount}개 보기
                </button>
              )}
              {/* 레슨이 없어도 문의 가능 */}
              <button type="button" css={s.btn("ghost")} onClick={openInquiry}>
                문의하기
              </button>
            </div>
          </div>
        )}
      </div>

      {inquiryOpen > 0 && (
        <InquiryModal key={inquiryOpen} open artistProfileId={id} artistName={artist.username} onClose={() => setInquiryOpen(0)} />
      )}
    </div>
  );
}

export default ArtistDetail;
