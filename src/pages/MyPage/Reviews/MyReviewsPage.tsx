/** @jsxImportSource @emotion/react */
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import * as s from "./styles";
import * as r from "../../../components/review/styles";
import MypageTabBar from "../../../components/common/MypageTabBar/MypageTabBar";
import ReviewItem from "../../../components/review/ReviewItem";
import ReviewSection from "../../../components/review/ReviewSection";
import ReplyEditor from "../../../components/review/ReplyEditor";
import ReviewFormModal, { type ReviewTarget } from "../../../components/review/ReviewFormModal";
import { useDeleteReview, useMyReviews, useReceivedReviews, useWritableReviews } from "../../../hooks/review/useReviews";
import { usePrincipalState } from "../../../stores/usePrincipalState";
import type { ReviewResp, WritableReviewResp } from "../../../Types/reviewTypes";
import { formatMonthDay, formatTime } from "../../../utils/reservationFormat";
import { getErrorMessage } from "../../../utils/errorUtils";
import { toast } from "../../../stores/useToastStore";

type Tab = "writable" | "written" | "received";

const DAY = 86_400_000;
const daysLeft = (until: string, now: number) => Math.ceil((new Date(until).getTime() - now) / DAY);

const targetOfWritable = (w: WritableReviewResp): ReviewTarget => ({
  reservationId: w.reservationId,
  lessonTitle: w.lessonTitle,
  artistName: w.artistName,
  when: `${formatMonthDay(w.lessonStartDt)} 레슨`,
});
const targetOfReview = (v: ReviewResp): ReviewTarget => ({
  reservationId: v.reservationId,
  lessonTitle: v.lessonTitle,
  artistName: v.artistName,
  when: `${formatMonthDay(v.lessonStartDt)} 레슨`,
});

// 마이페이지 > 리뷰 관리
//  - 작성 가능: 리뷰를 아직 안 쓴 완료 레슨 (완료 후 14일 안) -> 리뷰 쓰기
//  - 내가 쓴 리뷰: 수정(작성 후 7일 안) · 삭제, 아티스트 답글 확인
//  - 받은 리뷰(승인 아티스트): 요약 + 리뷰마다 답글 쓰기/수정/삭제
// 주소: ?tab=writable|written|received, ?write=예약ID 면 그 레슨의 리뷰 쓰기 창을 바로 엶 (예약 상세에서 이동)
function MyReviewsPage() {
  const isArtist = usePrincipalState((st) => st.principal?.artistStatus === "APPROVED");
  const [params, setParams] = useSearchParams();

  const writableQ = useWritableReviews();
  const myQ = useMyReviews();
  const receivedQ = useReceivedReviews(isArtist);
  const deleteM = useDeleteReview();
  // 마감·수정 가능 판단 기준 시각 (화면을 열 때 한 번)
  const [now] = useState(() => Date.now());

  const tabs: { key: Tab; label: string }[] = [
    { key: "writable", label: "작성 가능" },
    { key: "written", label: "내가 쓴 리뷰" },
    ...(isArtist ? [{ key: "received" as Tab, label: "받은 리뷰" }] : []),
  ];
  const rawTab = params.get("tab") as Tab | null;
  const tab: Tab = tabs.some((t) => t.key === rawTab) ? rawTab! : "writable";

  const counts: Record<Tab, number | undefined> = {
    writable: writableQ.data?.length,
    written: myQ.data?.length,
    received: receivedQ.data?.summary.reviewCount,
  };
  const unreplied = receivedQ.data?.reviews.filter((v) => !v.reply).length ?? 0;

  // 리뷰 쓰기/수정 창 (주소의 ?write= 로도 열림)
  const [form, setForm] = useState<{ target: ReviewTarget; editing: ReviewResp | null } | null>(null);
  const writeParam = Number(params.get("write")) || null;
  const fromParam = useMemo(() => {
    const w = writeParam ? writableQ.data?.find((x) => x.reservationId === writeParam) : undefined;
    return w ? { target: targetOfWritable(w), editing: null } : null;
  }, [writeParam, writableQ.data]);
  const activeForm = form ?? fromParam;

  const closeForm = () => {
    setForm(null);
    if (writeParam) {
      params.delete("write");
      setParams(params, { replace: true });
    }
  };

  const changeTab = (next: Tab) => {
    const p = new URLSearchParams(params);
    p.set("tab", next);
    p.delete("write");
    setParams(p);
  };

  const [deleting, setDeleting] = useState<number | null>(null);
  const remove = async (reviewId: number) => {
    try {
      await deleteM.mutateAsync(reviewId);
      toast.success("리뷰를 삭제했어요.");
      setDeleting(null);
    } catch (e) {
      toast.error(getErrorMessage(e, "리뷰를 삭제하지 못했어요."));
    }
  };

  return (
    <div css={s.page}>
      <div css={s.header}>
        <h1 css={s.title}>리뷰 관리</h1>
        <p css={s.desc}>
          완료한 레슨의 리뷰를 남기고, 내가 쓴 리뷰를 관리해요.{isArtist ? " 내 레슨에 달린 리뷰에는 답글을 남길 수 있어요." : ""}
        </p>
      </div>

      <MypageTabBar
        value={tab}
        items={tabs.map((t) => ({ key: t.key, label: counts[t.key] ? `${t.label} ${counts[t.key]}` : t.label }))}
        onChange={changeTab}
      />

      {/* ---------- 작성 가능 ---------- */}
      {tab === "writable" &&
        (writableQ.isLoading ? (
          <div css={r.stateBox}>불러오는 중...</div>
        ) : writableQ.isError ? (
          <div css={r.stateBox}>
            목록을 불러오지 못했어요.
            <button type="button" css={r.textButton} onClick={() => writableQ.refetch()}>
              다시 불러오기
            </button>
          </div>
        ) : !writableQ.data?.length ? (
          <div css={r.stateBox}>
            리뷰를 기다리는 레슨이 없어요.
            <span>레슨이 완료되면 14일 동안 리뷰를 남길 수 있어요.</span>
            <Link to="/lessons" css={r.textButton}>
              레슨 찾아보기
            </Link>
          </div>
        ) : (
          <>
            <p css={s.hint}>레슨이 완료된 날부터 14일 안에 리뷰를 남길 수 있어요.</p>
            <ul css={s.writableList}>
              {writableQ.data.map((w) => {
                const left = daysLeft(w.writableUntil, now);
                return (
                  <li key={w.reservationId} css={s.writableCard}>
                    <div css={s.writableInfo}>
                      <strong>{w.lessonTitle}</strong>
                      <span>
                        {w.artistName} · {formatMonthDay(w.lessonStartDt)} {formatTime(w.lessonStartDt)} 레슨
                      </span>
                    </div>
                    <span css={s.deadline(left <= 3)}>{left <= 0 ? "오늘 마감" : `${left}일 남음`}</span>
                    <button type="button" css={r.btn("primary", true)} onClick={() => setForm({ target: targetOfWritable(w), editing: null })}>
                      리뷰 쓰기
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        ))}

      {/* ---------- 내가 쓴 리뷰 ---------- */}
      {tab === "written" &&
        (myQ.isLoading ? (
          <div css={r.stateBox}>불러오는 중...</div>
        ) : myQ.isError ? (
          <div css={r.stateBox}>
            리뷰를 불러오지 못했어요.
            <button type="button" css={r.textButton} onClick={() => myQ.refetch()}>
              다시 불러오기
            </button>
          </div>
        ) : !myQ.data?.length ? (
          <div css={r.stateBox}>아직 쓴 리뷰가 없어요.</div>
        ) : (
          <div css={r.list}>
            {myQ.data.map((v) => {
              const editable = new Date(v.editableUntil).getTime() > now;
              return (
                <ReviewItem
                  key={v.reviewId}
                  review={v}
                  showLesson
                  showArtist
                  actions={
                    deleting === v.reviewId ? (
                      <>
                        <span css={r.muted}>삭제할까요? 다시 쓸 수 없어요.</span>
                        <button type="button" css={r.textButton} onClick={() => setDeleting(null)} disabled={deleteM.isPending}>
                          아니요
                        </button>
                        <button type="button" css={r.textButtonDanger} onClick={() => remove(v.reviewId)} disabled={deleteM.isPending}>
                          삭제
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          css={r.textButton}
                          disabled={!editable}
                          title={editable ? undefined : "작성 후 7일이 지나 수정할 수 없어요"}
                          onClick={() => setForm({ target: targetOfReview(v), editing: v })}
                        >
                          수정
                        </button>
                        <button type="button" css={r.textButtonDanger} onClick={() => setDeleting(v.reviewId)}>
                          삭제
                        </button>
                      </>
                    )
                  }
                />
              );
            })}
          </div>
        ))}

      {/* ---------- 받은 리뷰 (아티스트) ---------- */}
      {tab === "received" && isArtist && (
        <>
          {unreplied > 0 && <p css={s.notice}>답글을 기다리는 리뷰가 {unreplied}개 있어요.</p>}
          <ReviewSection
            data={receivedQ.data}
            isLoading={receivedQ.isLoading}
            isError={receivedQ.isError}
            onRetry={() => receivedQ.refetch()}
            showLesson
            emptyText="아직 받은 리뷰가 없어요. 레슨이 완료되면 수강생이 리뷰를 남길 수 있어요."
            extraFilter={{ label: "답글 안 단 리뷰만", test: (v) => !v.reply }}
            renderReplyArea={(v) => <ReplyEditor review={v} />}
          />
        </>
      )}

      {activeForm && (
        <ReviewFormModal
          key={`${activeForm.target.reservationId}-${activeForm.editing?.reviewId ?? "new"}`}
          open
          target={activeForm.target}
          editing={activeForm.editing}
          onClose={closeForm}
        />
      )}
    </div>
  );
}

export default MyReviewsPage;
