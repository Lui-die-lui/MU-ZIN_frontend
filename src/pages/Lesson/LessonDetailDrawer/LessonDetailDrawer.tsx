/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { usePublicLessonDetail } from "../../../hooks/usePublicLessonDetail";
import SideDrawer from "../../../components/common/SideDrawer/SideDrawer";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArtistHeader from "./ArtistHeader";
import DetailTimeFilterPanel from "./DetailTimeFilterPanel/DetailTimeFilterPanel";
import {
  EMPTY_OPEN_SLOT_FILTER,
  TIME_PART_LABEL,
  WEEKDAY_LABEL,
  type OpenSlotFilter,
  type SlotItem,
} from "../../../Types/searchForTimeTypes";
import LessonTimeSlotSection from "./LessonTimeSlotSection/LessonTimeSlotSection";
import { hasTimeFilter } from "../LessonSearch/SearchTimeFilter/hasTimeFilter";
import { useCreateReservation } from "../../../hooks/reservation/useCreateReservation";
import ReservationSuccessView from "./ReservationSuccessView/ReservationSuccessView";
import RequestReservationView, { type ReservationSummary } from "./RequestReservationView/RequestReservationView";
import { LESSON_MODE_LABEL, type Mode } from "../../../Types/lessonTypes";
import { usePrincipalState } from "../../../stores/usePrincipalState";
import { ApiError } from "../../../utils/errorUtils";
import { FaSlidersH } from "react-icons/fa";
import { useLessonReviews } from "../../../hooks/review/useReviews";
import ReviewSection from "../../../components/review/ReviewSection";
import { StarDisplay } from "../../../components/review/StarRating";

export type Props = {
  open: boolean;
  lessonId: number | null;
  onClose: () => void;
  initialOpenSlotFilter?: OpenSlotFilter | null;
  // 아티스트 공개 프로필에서 열 때: 이미 그 아티스트 화면이라 상단 아티스트 링크를 숨김
  hideArtistHeader?: boolean;
  // 예약할 수 없는 이유 (예: 내 레슨) - 있으면 시간은 보여주되 요청 버튼을 막고 이유를 표시
  reserveBlockedReason?: string | null;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const p2 = (n: number) => String(n).padStart(2, "0");

// "10월 19일 (월) 10:00 – 11:00"
const formatWhen = (startDt: string, durationMin: number) => {
  const d = new Date(startDt);
  const end = new Date(d.getTime() + durationMin * 60_000);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]}) ${p2(d.getHours())}:${p2(d.getMinutes())} – ${p2(end.getHours())}:${p2(end.getMinutes())}`;
};

const formatPrice = (price: number | null | undefined) =>
  price == null ? "가격 문의" : price === 0 ? "무료" : `${price.toLocaleString("ko-KR")}원`;

// 적용된 시간 조건을 한 줄로 ("10/20~10/31 · 월·수 · 오전")
const filterSummary = (f: OpenSlotFilter) => {
  const parts: string[] = [];
  const md = (v?: string) => (v ? `${Number(v.slice(5, 7))}/${Number(v.slice(8, 10))}` : "");
  if (f.from || f.to) parts.push(`${md(f.from)}~${md(f.to)}`);
  if (f.daysOfWeek?.length) parts.push(f.daysOfWeek.map((d) => WEEKDAY_LABEL[d]).join("·"));
  if (f.timeParts?.length) parts.push(f.timeParts.map((t) => TIME_PART_LABEL[t]).join("·"));
  return parts.join(" · ");
};

const STEPS: { key: Mode; label: string }[] = [
  { key: "pick", label: "시간 선택" },
  { key: "request", label: "요청 보내기" },
  { key: "success", label: "완료" },
];

// 레슨 상세 + 예약 요청 (레슨 검색 / 아티스트 공개 프로필에서 공용)
// 흐름: ① 시간 선택 → ② 요청 보내기(확인 + 메시지) → ③ 완료. 주요 버튼은 항상 아래 고정 영역에 있음
function LessonDetailDrawer({
  open,
  lessonId,
  onClose,
  initialOpenSlotFilter = null, // lessonId 없으면 렌더 요청 하지않기
  hideArtistHeader = false,
  reserveBlockedReason = null,
}: Props) {
  const id = lessonId ?? 0;
  const { data, isLoading, isError } = usePublicLessonDetail(id);
  const isAuthenticated = usePrincipalState((st) => st.isAuthenticated);
  // 예약은 이메일 인증 완료 유저만 가능 (서버도 403 EMAIL_NOT_VERIFIED 로 막음)
  const needsEmailVerify = usePrincipalState((st) => st.isAuthenticated && st.principal?.emailVerified === false);
  const navigate = useNavigate();
  const location = useLocation();

  // 적용된 시간 조건
  const [appliedTime, setAppliedTime] = useState<OpenSlotFilter | null>(EMPTY_OPEN_SLOT_FILTER);
  const [filterOpen, setFilterOpen] = useState(false);

  // 페이지 자체로 넘기지 않고 사이드 바 내에서 레슨 요청 보내기 위해 필요
  const [mode, setMode] = useState<Mode>("pick");
  const [selectedSlot, setSelectedSlot] = useState<SlotItem | null>(null);
  const [requestMsg, setRequestMsg] = useState("");
  const [noticeAck, setNoticeAck] = useState(false);
  const [submitError, setSubmitError] = useState<{ message: string; slotGone: boolean } | null>(null);

  // 레슨이 바뀌면 필터/화면 상태 초기화
  useEffect(() => {
    if (!lessonId) return;
    setAppliedTime(initialOpenSlotFilter); // 검색에서 넘어온 값 세팅
    setFilterOpen(false);
    setMode("pick");
    setSelectedSlot(null);
    setRequestMsg("");
    setNoticeAck(false);
    setSubmitError(null);
  }, [lessonId, initialOpenSlotFilter]);

  const createM = useCreateReservation(id);
  // 레슨 리뷰 (제목 아래 별점 요약 + 아래쪽 리뷰 모음)
  const reviewsQ = useLessonReviews(lessonId);
  const reviewSummary = reviewsQ.data?.summary;
  const scrollToReviews = () =>
    document.getElementById("lesson-reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const durationMin = data?.durationMin ?? 0;
  const metaText = data
    ? [LESSON_MODE_LABEL[data.mode] ?? data.mode, `${data.durationMin}분`, formatPrice(data.price)].join(" · ")
    : "";
  const summary: ReservationSummary | null =
    data && selectedSlot ? { title: data.title, when: formatWhen(selectedSlot.startDt, durationMin), meta: metaText } : null;
  const filtering = hasTimeFilter(appliedTime);

  const goLogin = () => {
    onClose();
    navigate("/signin", { state: { from: location } });
  };

  const goVerifyEmail = () => {
    onClose();
    navigate("/mypage/account");
  };

  const submit = async () => {
    if (!selectedSlot || !noticeAck) return;
    try {
      setSubmitError(null);
      await createM.mutateAsync({
        timeSlotId: selectedSlot.timeSlotId,
        requestMsg: requestMsg.trim() ? requestMsg.trim() : null,
        noticeAcknowledged: true,
      });
      setMode("success");
    } catch (e) {
      const slotGone = e instanceof ApiError && e.httpStatus === 409; // 다른 사람이 먼저 요청했거나 지난 시간
      setSubmitError({ message: e instanceof Error ? e.message : "예약 요청에 실패했어요.", slotGone });
    }
  };

  const pickAgain = () => {
    setMode("pick");
    setSelectedSlot(null);
    setSubmitError(null);
  };

  // ---------- 아래 고정 영역 (단계별 주요 버튼) ----------
  let footer: React.ReactNode = null;
  if (data && !data.autoClosed) {
    if (mode === "pick") {
      footer = (
        <div css={s.footerInner}>
          <div css={s.footerInfo}>
            {selectedSlot ? (
              <>
                <span css={s.footerLabel}>선택한 시간</span>
                <strong>{formatWhen(selectedSlot.startDt, durationMin)}</strong>
              </>
            ) : (
              <span css={s.footerHint}>
                {reserveBlockedReason ??
                  (needsEmailVerify ? "이메일 인증 후 예약할 수 있어요." : "위에서 원하는 시간을 골라주세요.")}
              </span>
            )}
          </div>
          {!isAuthenticated ? (
            <button type="button" css={s.primaryBtn} onClick={goLogin}>
              로그인하고 예약하기
            </button>
          ) : needsEmailVerify && !reserveBlockedReason ? (
            <button type="button" css={s.primaryBtn} onClick={goVerifyEmail}>
              이메일 인증하러 가기
            </button>
          ) : (
            <button
              type="button"
              css={s.primaryBtn}
              disabled={!selectedSlot || !!reserveBlockedReason}
              onClick={() => {
                setSubmitError(null);
                setMode("request");
              }}
            >
              이 시간으로 요청하기
            </button>
          )}
          {selectedSlot && (reserveBlockedReason || needsEmailVerify) && (
            <span css={s.footerHint}>{reserveBlockedReason ?? "이메일 인증 후 예약할 수 있어요."}</span>
          )}
        </div>
      );
    } else if (mode === "request") {
      footer = (
        <div css={s.requestFooter}>
          <div css={s.noticeBox}>
            <p>레슨은 아티스트와 직접 하는 약속이에요. 결제와 환불은 MU:ZIN 밖에서 두 분이 직접 정해요.</p>
            <label css={s.noticeCheck}>
              <input type="checkbox" checked={noticeAck} disabled={createM.isPending} onChange={(e) => setNoticeAck(e.target.checked)} />
              확인했어요
            </label>
          </div>
          <div css={s.footerRow}>
            <button type="button" css={s.ghostBtn} onClick={pickAgain} disabled={createM.isPending}>
              ← 시간 다시 고르기
            </button>
            <button type="button" css={s.primaryBtn} onClick={submit} disabled={createM.isPending || !selectedSlot || !noticeAck}>
              {createM.isPending ? "보내는 중..." : "예약 요청 보내기"}
            </button>
          </div>
        </div>
      );
    } else {
      footer = (
        <div css={s.footerRow}>
          <button
            type="button"
            css={s.ghostBtn}
            onClick={() => {
              onClose();
              navigate("/mypage/reservations");
            }}
          >
            내 예약 보기
          </button>
          <button type="button" css={s.primaryBtn} onClick={onClose}>
            닫기
          </button>
        </div>
      );
    }
  }

  return (
    <SideDrawer open={open} onClose={onClose} title="레슨 상세" width={460} footer={footer}>
      {isLoading && <div css={s.stateText}>레슨 정보를 불러오는 중...</div>}
      {isError && (
        <div css={s.stateText} role="alert">
          레슨 정보를 불러오지 못했어요. 비공개로 바뀌었거나 삭제된 레슨일 수 있어요.
        </div>
      )}

      {data && lessonId != null && (
        <div css={s.wrap}>
          {/* 지금 어느 단계인지 */}
          {!data.autoClosed && (
            <ol css={s.steps} aria-label="예약 단계">
              {STEPS.map((st, i) => {
                const cur = STEPS.findIndex((x) => x.key === mode);
                return (
                  <li key={st.key} css={s.step(i === cur, i < cur)} aria-current={i === cur ? "step" : undefined}>
                    <span>{i < cur ? "✓" : i + 1}</span>
                    {st.label}
                  </li>
                );
              })}
            </ol>
          )}

          {!hideArtistHeader && <ArtistHeader artist={data.artist} />}

          <div>
            <h2 css={s.title}>{data.title}</h2>
            <p css={s.metaLine}>{metaText}</p>
            {data.price !== 0 && <p css={s.priceNote}>레슨비는 아티스트에게 직접 전달해요.</p>}
            {reviewSummary && reviewSummary.reviewCount > 0 && mode === "pick" && (
              <button type="button" css={s.ratingLine} onClick={scrollToReviews}>
                <StarDisplay value={reviewSummary.averageRating} size={14} />
                <strong>{reviewSummary.averageRating.toFixed(1)}</strong>
                <span>리뷰 {reviewSummary.reviewCount}개</span>
              </button>
            )}
          </div>

          {/* 검색 결과를 연 뒤 마지막 시간이 마감되는 등으로 자동 비공개된 레슨 */}
          {data.autoClosed && (
            <div css={s.closedNotice} role="status">
              <strong>현재 예약할 수 없는 레슨이에요</strong>
              예약 가능한 시간이 모두 마감되어 지금은 검색에 보이지 않는 레슨이에요. 아티스트가 새 시간을 열면 다시 예약할 수 있어요.
            </div>
          )}

          {mode === "pick" && (
            <>
              {(data.description || data.requirementText) && (
                <div css={s.infoBlock}>
                  {data.description && (
                    <div>
                      <h3 css={s.blockTitle}>레슨 소개</h3>
                      <p css={s.bodyText}>{data.description}</p>
                    </div>
                  )}
                  {data.requirementText && (
                    <div>
                      <h3 css={s.blockTitle}>준비물·요청사항</h3>
                      <p css={s.bodyText}>{data.requirementText}</p>
                    </div>
                  )}
                </div>
              )}

              {!data.autoClosed && (
                <section css={s.slotSection} aria-labelledby="slot-title">
                  <div css={s.slotHeader}>
                    <h3 id="slot-title" css={s.blockTitle}>
                      예약 가능한 시간
                    </h3>
                    <button
                      type="button"
                      css={s.filterToggle(filterOpen || filtering)}
                      aria-expanded={filterOpen}
                      onClick={() => setFilterOpen((v) => !v)}
                    >
                      <FaSlidersH size={12} aria-hidden="true" />
                      시간대 필터
                      {filtering && <span css={s.filterDot} aria-label="조건 적용 중" />}
                    </button>
                  </div>

                  {filtering && appliedTime && (
                    <div css={s.appliedChip}>
                      <span>{filterSummary(appliedTime)}</span>
                      <button
                        type="button"
                        aria-label="시간 조건 해제"
                        onClick={() => {
                          setAppliedTime(null);
                          setSelectedSlot(null);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {filterOpen && (
                    <div css={s.filterBox}>
                      <DetailTimeFilterPanel
                        initial={appliedTime}
                        onApply={(next) => {
                          setAppliedTime(next);
                          setSelectedSlot(null); // 다른 목록이 되니 선택 해제
                          setFilterOpen(false); // 적용하면 접어서 결과가 바로 보이게
                        }}
                      />
                    </div>
                  )}

                  <LessonTimeSlotSection
                    lessonId={lessonId}
                    filter={appliedTime}
                    selectedId={selectedSlot?.timeSlotId ?? null}
                    onSelect={setSelectedSlot}
                  />
                </section>
              )}

              <section id="lesson-reviews" css={s.reviewSection} aria-labelledby="review-title">
                <h3 id="review-title" css={s.blockTitle}>
                  리뷰{reviewSummary?.reviewCount ? ` ${reviewSummary.reviewCount}` : ""}
                </h3>
                <ReviewSection
                  data={reviewsQ.data}
                  isLoading={reviewsQ.isLoading}
                  isError={reviewsQ.isError}
                  onRetry={() => reviewsQ.refetch()}
                  limit={3}
                  compact
                  emptyText="아직 리뷰가 없어요. 레슨을 받은 수강생만 리뷰를 남길 수 있어요."
                />
              </section>
            </>
          )}

          {mode === "request" && summary && (
            <RequestReservationView
              summary={summary}
              requestMsg={requestMsg}
              onChangeMsg={setRequestMsg}
              pending={createM.isPending}
              errorMsg={submitError?.message ?? null}
              onPickAgain={submitError?.slotGone ? pickAgain : undefined}
            />
          )}

          {mode === "success" && summary && <ReservationSuccessView summary={summary} />}
        </div>
      )}
    </SideDrawer>
  );
}
export default LessonDetailDrawer;
