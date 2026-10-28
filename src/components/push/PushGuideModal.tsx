/** @jsxImportSource @emotion/react */
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import * as s from "./styles";
import CommonModal from "../common/CommonModal/CommonModal";
import { modalBtn } from "../common/CommonModal/modalButtons";
import PushEnablePanel from "./PushEnablePanel";
import { BellIcon, HomeAddIcon, OpenAppIcon, ShareIcon, BrowserIcon, InfoIcon } from "./icons";
import { detectPushEnv, type PushEnv } from "../../push/pushEnv";
import { canInstall, promptInstall, subscribeInstall } from "../../push/installPrompt";

type Card = { key: string; icon: ReactNode; title: string; body: ReactNode };

type Props = {
  open: boolean;
  onLater: () => void; // 닫기·나중에 (이번 세션만)
  onDone: () => void; // "확인했어요" 체크 후 완료
};

function InstallButton() {
  const available = useSyncExternalStore(subscribeInstall, canInstall, () => false);
  if (!available) return null; // 브라우저가 설치 창을 허락했을 때만
  return (
    <button type="button" css={s.secondaryBtn} onClick={() => void promptInstall()}>
      홈 화면에 추가
    </button>
  );
}

// 기기·브라우저 상태에 맞는 안내 카드
function buildCards(env: PushEnv): Card[] {
  const intro: Card = {
    key: "intro",
    icon: <BellIcon />,
    title: "새 메시지와 예약 소식을 휴대폰 알림으로 받아보세요.",
    body: "MU:ZIN 화면을 보고 있지 않아도 새 채팅과 예약 확정·거절·취소 소식을 알려 드려요. 휴대폰 설정이나 네트워크에 따라 알림이 늦거나 보이지 않을 수 있어요.",
  };
  const enable: Card = {
    key: "enable",
    icon: <BellIcon />,
    title: env.platform === "desktop" ? "브라우저 알림 켜기" : "알림 켜기",
    body: <PushEnablePanel />,
  };

  switch (env.readiness) {
    case "ios-install":
      return [
        intro,
        {
          key: "share",
          icon: <ShareIcon />,
          title: "공유 또는 메뉴 버튼 열기",
          body: "브라우저의 공유 버튼이나 메뉴 버튼을 눌러요. 버튼 위치는 브라우저마다 달라요 (화면 아래나 주소창 옆).",
        },
        {
          key: "add",
          icon: <HomeAddIcon />,
          title: "'홈 화면에 추가' 선택",
          body: "목록에서 '홈 화면에 추가'를 찾아 눌러요. 안 보이면 목록을 아래로 넘기거나 '더 보기'를 눌러 보세요.",
        },
        {
          key: "launch",
          icon: <OpenAppIcon />,
          title: "MU:ZIN 아이콘으로 실행",
          body: "홈 화면에 생긴 MU:ZIN 아이콘으로 열어요. 처음 열면 다시 로그인해야 할 수 있어요.",
        },
        {
          key: "allow",
          icon: <BellIcon />,
          title: "알림 켜기 → 허용",
          body: "아이콘으로 연 MU:ZIN 에서 이 안내나 마이페이지 > 알림 설정의 '알림 켜기'를 누르고, 알림 요청 창에서 '허용'을 선택해요.",
        },
      ];
    case "ios-old":
      return [
        intro,
        {
          key: "old",
          icon: <InfoIcon />,
          title: "iOS 16.4 이상에서 쓸 수 있어요",
          body: "이 기기는 웹 알림을 지원하지 않는 버전이에요. 설정 > 일반 > 소프트웨어 업데이트에서 업데이트한 뒤 다시 확인해 주세요.",
        },
      ];
    case "in-app":
      return [
        intro,
        {
          key: "inapp",
          icon: <BrowserIcon />,
          title: env.platform === "ios" ? "Safari 등 기본 브라우저로 열기" : "Chrome 등 기본 브라우저로 열기",
          body: "카카오톡·인스타그램 같은 앱 안에서 연 화면에서는 알림을 받을 수 없어요. 메뉴(⋯)에서 '다른 브라우저로 열기'를 누르거나, mu-zin.com 을 브라우저 주소창에 직접 입력해 주세요.",
        },
      ];
    case "insecure":
    case "unsupported":
      return [
        intro,
        {
          key: "unsupported",
          icon: <InfoIcon />,
          title: "이 브라우저에서는 알림을 받을 수 없어요",
          body:
            env.platform === "ios"
              ? "홈 화면에 추가한 MU:ZIN 에서 다시 확인해 주세요."
              : "최신 Chrome, Edge, Firefox, 삼성 인터넷 등에서 다시 열어 주세요. 그동안 새 소식은 상단의 종 아이콘에서 확인할 수 있어요.",
        },
      ];
    case "ready": {
      const cards = [intro, enable];
      // 안드로이드: 홈 화면 추가는 선택 (설치 없이도 알림 가능)
      if (env.platform === "android" && !env.standalone) {
        cards.push({
          key: "install",
          icon: <HomeAddIcon />,
          title: "홈 화면에 추가 (선택)",
          body: (
            <>
              <p>알림은 지금 브라우저에서도 받을 수 있어요. 앱처럼 바로 열고 싶다면 홈 화면에 추가해 보세요. 버튼이 없으면 브라우저 메뉴(⋮)에서 '홈 화면에 추가' 또는 '앱 설치'를 눌러요.</p>
              <InstallButton />
            </>
          ),
        });
      }
      return cards;
    }
  }
}

// 옆으로 넘기는 알림 설정 안내 (모바일 스와이프 / 이전·다음 버튼 / ← → 키)
function PushGuideModal({ open, onLater, onDone }: Props) {
  const [env] = useState(detectPushEnv);
  const cards = useMemo(() => buildCards(env), [env]);
  const total = cards.length + 1; // 마지막 = 확인 카드
  const [index, setIndex] = useState(0);
  const [checked, setChecked] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);
  const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const go = (i: number) => {
    const next = Math.max(0, Math.min(total - 1, i));
    const el = trackRef.current;
    if (el) el.scrollTo({ left: next * el.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
    setIndex(next);
  };

  // 손으로 넘긴 경우 현재 카드 맞춤
  const onScroll = () => {
    const el = trackRef.current;
    if (!el || !el.clientWidth) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
  };

  // 창 크기가 바뀌면 현재 카드 위치 유지
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => el.scrollTo({ left: indexRef.current * el.clientWidth }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  const onKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("input, textarea")) return; // 체크박스 위에서는 기본 동작
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    }
  };

  const last = index === total - 1;

  return (
    <CommonModal
      open={open}
      title="알림 설정 안내"
      onClose={onLater}
      width={440}
      footer={
        <div css={s.footer}>
          <button type="button" css={s.textBtn} onClick={onLater}>
            나중에
          </button>
          <div css={s.footerNav}>
            <button type="button" css={modalBtn("secondary")} onClick={() => go(index - 1)} disabled={index === 0} aria-label="이전 안내">
              이전
            </button>
            {last ? (
              <button type="button" css={modalBtn("primary")} onClick={onDone} disabled={!checked}>
                완료
              </button>
            ) : (
              <button type="button" css={modalBtn("primary")} onClick={() => go(index + 1)} aria-label="다음 안내">
                다음
              </button>
            )}
          </div>
        </div>
      }
    >
      <div css={s.carousel} onKeyDown={onKeyDown}>
        <div
          ref={trackRef}
          css={s.track}
          onScroll={onScroll}
          tabIndex={0}
          role="group"
          aria-label="알림 설정 안내 카드. 좌우 화살표 키로 넘길 수 있어요."
        >
          {cards.map((c, i) => (
            <section
              key={c.key}
              css={s.card}
              aria-roledescription="안내 카드"
              aria-label={`${i + 1} / ${total}`}
              aria-hidden={i !== index}
              inert={i !== index}
            >
              <div css={s.icon} aria-hidden="true">
                {c.icon}
              </div>
              <h3 css={s.cardTitle}>{c.title}</h3>
              <div css={s.cardBody}>{typeof c.body === "string" ? <p>{c.body}</p> : c.body}</div>
            </section>
          ))}
          <section
            css={s.card}
            aria-roledescription="안내 카드"
            aria-label={`${total} / ${total}`}
            aria-hidden={!last}
            inert={!last}
          >
            <div css={s.icon} aria-hidden="true">
              <BellIcon />
            </div>
            <h3 css={s.cardTitle}>언제든 다시 볼 수 있어요</h3>
            <div css={s.cardBody}>
              <p>마이페이지 &gt; 알림 설정에서 이 안내를 다시 보고, 이 기기의 알림을 켜거나 끌 수 있어요.</p>
              <label css={s.check}>
                <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
                확인했어요
              </label>
              <p css={s.note}>체크하고 완료하면 이 기기에서 이 안내가 다시 자동으로 뜨지 않아요. 알림이 켜지는 것은 아니에요.</p>
            </div>
          </section>
        </div>

        <div css={s.dots} role="group" aria-label="안내 단계">
          <span css={s.srOnly} aria-live="polite">
            {index + 1} / {total}
          </span>
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              type="button"
              css={s.dot(i === index)}
              aria-label={`${i + 1}번째 안내`}
              aria-current={i === index ? "step" : undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
      </div>
    </CommonModal>
  );
}

export default PushGuideModal;
