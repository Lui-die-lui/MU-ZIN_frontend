/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useState } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import LessonDetailDrawer from "../../Lesson/LessonDetailDrawer/LessonDetailDrawer";
import { LESSON_MODE_LABEL } from "../../../Types/lessonTypes";
import type { ArtistLessonCardResp } from "../../../Types/artistSearchTypes";

type Props = {
  artistProfileId: number;
  isOwner: boolean;
  query: UseQueryResult<ArtistLessonCardResp[]>;
};

const formatPrice = (price: number | null | undefined) => {
  if (price == null) return "가격 문의";
  if (price === 0) return "무료";
  return `${price.toLocaleString("ko-KR")}원`;
};

// 아티스트의 공개 레슨 목록 - 카드를 누르면 레슨 검색 화면과 같은 상세 창(시간 선택 → 요청 메시지 → 완료)
// (예전엔 고른 레슨의 상세·시간이 목록 맨 아래에 펼쳐져서, 레슨이 많으면 눌러도 변화가 안 보였음)
function ArtistLessons({ isOwner, query }: Props) {
  const [openId, setOpenId] = useState<number | null>(null);
  const lessons = query.data ?? [];

  return (
    <section css={s.card} id="artist-lessons" aria-labelledby="artist-lessons-title">
      <h2 id="artist-lessons-title" css={s.sectionTitle}>
        레슨 {query.isSuccess && <span>{lessons.length}개</span>}
      </h2>

      {query.isLoading ? (
        <div css={s.lessonGrid}>
          <div css={s.skeleton(118)} />
          <div css={s.skeleton(118)} />
        </div>
      ) : query.isError ? (
        <p css={s.mutedText} role="alert">
          레슨 목록을 불러오지 못했어요.{" "}
          <button type="button" css={s.btn("ghost")} onClick={() => query.refetch()}>
            다시 불러오기
          </button>
        </p>
      ) : lessons.length === 0 ? (
        <p css={s.mutedText}>
          {isOwner
            ? "공개 중이면서 예약 가능한 시간이 있는 레슨이 여기에 보여요. 마이페이지의 레슨 관리에서 확인해보세요."
            : "지금 예약할 수 있는 레슨이 없어요. 새 레슨이 열리면 여기에 보여요."}
        </p>
      ) : (
        <>
          <div css={s.lessonGrid}>
            {lessons.map((lesson) => (
              <button type="button" key={lesson.lessonId} css={s.lessonCard} onClick={() => setOpenId(lesson.lessonId)}>
                <div css={s.lessonTop}>
                  <span css={s.instBadge}>{lesson.instrument?.instName}</span>
                  <span css={s.arrow} aria-hidden="true">
                    →
                  </span>
                </div>
                <h3 css={s.lessonTitle}>{lesson.title}</h3>
                <div css={s.lessonMeta}>
                  <span>{LESSON_MODE_LABEL[lesson.mode] ?? lesson.mode}</span>
                  <span aria-hidden="true">·</span>
                  <span>{lesson.durationMin}분</span>
                  <span aria-hidden="true">·</span>
                  <strong>{formatPrice(lesson.price)}</strong>
                </div>
              </button>
            ))}
          </div>
          <p css={s.lessonHint}>레슨을 누르면 예약 가능한 시간을 보고 바로 요청할 수 있어요.</p>
        </>
      )}

      <LessonDetailDrawer
        open={openId != null}
        lessonId={openId}
        onClose={() => setOpenId(null)}
        hideArtistHeader
        reserveBlockedReason={isOwner ? "내 레슨이라 예약할 수 없어요. 시간 관리는 마이페이지의 레슨 관리에서 할 수 있어요." : null}
      />
    </section>
  );
}

export default ArtistLessons;
