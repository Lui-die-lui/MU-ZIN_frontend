/** @jsxImportSource @emotion/react */
import { Link } from "react-router-dom";
import * as s from "./styles";
import type { AssistantCard } from "../../Types/assistantTypes";
import { LESSON_MODE_LABEL } from "../../Types/lessonTypes";
import { formatMonthDay, formatPrice, formatTime } from "../../utils/reservationFormat";

// 추천 카드 - 모든 값은 서버가 지금 DB 에서 채운 것 (모델이 쓴 가격·링크·예약 가능 여부는 쓰지 않음)
function AssistantCards({ cards }: { cards: AssistantCard[] }) {
  if (cards.length === 0) return null;
  return (
    <ul css={s.cards} aria-label="추천">
      {cards.map((c) => (
        <li key={`${c.kind}-${c.id}`} style={{ display: "grid" }}>
          {!c.available ? (
            <div css={s.unavailable}>
              {c.kind === "LESSON" ? "지금은 볼 수 없는 레슨이에요." : "지금은 볼 수 없는 아티스트예요."} 비공개로 바뀌었거나 삭제됐어요.
            </div>
          ) : c.kind === "LESSON" ? (
            <LessonCard c={c} />
          ) : (
            <ArtistCard c={c} />
          )}
        </li>
      ))}
    </ul>
  );
}

function regionText(c: AssistantCard) {
  const extra = c.serviceRegions.filter((r) => r !== c.mainRegion);
  if (!c.mainRegion && extra.length === 0) return "지역 정보 없음";
  if (!c.mainRegion) return `활동 지역 ${extra.slice(0, 2).join(", ")}${extra.length > 2 ? ` 외 ${extra.length - 2}곳` : ""}`;
  return extra.length ? `${c.mainRegion} · 활동 지역 ${extra.length}곳` : c.mainRegion;
}

function LessonCard({ c }: { c: AssistantCard }) {
  const first = c.nextSlots[0];
  return (
    <article css={s.card} aria-label={`레슨 ${c.title ?? ""}`}>
      <div css={s.cardTop}>
        <span css={s.kind}>레슨</span>
        {c.instruments.map((i) => (
          <span key={i} css={s.chip}>
            {i}
          </span>
        ))}
      </div>
      <div style={{ display: "grid", gap: 4 }}>
        <h3 css={s.cardTitle}>{c.title}</h3>
        <p css={s.cardMeta}>
          {c.artistName} · {regionText(c)}
        </p>
      </div>
      <dl css={s.facts}>
        <div>
          <dt>가격</dt>
          <dd>{formatPrice(c.price)}</dd>
        </div>
        <div>
          <dt>수업 시간</dt>
          <dd>{c.durationMin ? `${c.durationMin}분` : "-"}</dd>
        </div>
        <div>
          <dt>방식</dt>
          <dd>{c.mode ? LESSON_MODE_LABEL[c.mode] : "-"}</dd>
        </div>
      </dl>
      <p css={s.slots}>
        {first ? (
          <>
            앞으로 4주 예약 가능 <strong>{c.openSlotCount}개</strong> · 가장 빠른 시간{" "}
            <strong>
              {formatMonthDay(first.startDt)} {formatTime(first.startDt)}
            </strong>
          </>
        ) : (
          "앞으로 4주 안에 열린 시간이 없어요. 상세에서 문의하거나 다른 시간을 확인해 보세요."
        )}
      </p>
      {c.reason && (
        <p css={s.reason}>
          <span>추천 이유</span>
          {c.reason}
        </p>
      )}
      <div css={s.cardActions}>
        {c.link && (
          <Link to={c.link} css={s.cardLink}>
            레슨 상세 보기
          </Link>
        )}
        {c.artistProfileId && (
          <Link to={`/artists/${c.artistProfileId}`} css={s.secondaryBtn}>
            아티스트 보기
          </Link>
        )}
      </div>
    </article>
  );
}

function ArtistCard({ c }: { c: AssistantCard }) {
  return (
    <article css={s.card} aria-label={`아티스트 ${c.artistName ?? ""}`}>
      <div css={s.cardTop}>
        <span css={s.kind}>아티스트</span>
        {c.instruments.slice(0, 3).map((i) => (
          <span key={i} css={s.chip}>
            {i}
          </span>
        ))}
      </div>
      <div style={{ display: "grid", gap: 4 }}>
        <h3 css={s.cardTitle}>{c.artistName}</h3>
        <p css={s.cardMeta}>
          {c.majorName ? `${c.majorName} 전공 · ` : ""}
          {regionText(c)}
        </p>
      </div>
      <p css={s.slots}>
        공개 레슨 <strong>{c.publicLessonCount ?? 0}개</strong>
      </p>
      {c.reason && (
        <p css={s.reason}>
          <span>추천 이유</span>
          {c.reason}
        </p>
      )}
      <div css={s.cardActions}>
        {c.link && (
          <Link to={c.link} css={s.cardLink}>
            아티스트 프로필 보기
          </Link>
        )}
      </div>
    </article>
  );
}

export default AssistantCards;
