/** @jsxImportSource @emotion/react */
import * as s from "../../styles";
import { useEffect, useState } from "react";
import { usePrincipalState } from "../../../../../stores/usePrincipalState";
import { useMutation } from "@tanstack/react-query";
import { sendEmailCodeReq } from "../../../../../apis/auth/authApi";
import { MdEmail } from "react-icons/md";
import AccountInfoRow from "../../AccountInfoRow/AccountInfoRow";
import { toast } from "../../../../../stores/useToastStore";
import { ApiError } from "../../../../../utils/errorUtils";

// 서버와 같은 값: 인증 링크 유효시간 = 재발송 대기시간 3분
const COOLDOWN_MS = 3 * 60 * 1000;
const storageKey = (userId?: number) => `verifyMailCooldownUntil:${userId ?? "anon"}`;

// 새로고침해도 카운트다운이 이어지게 sessionStorage 에 보관 (실제 제한은 서버가 강제)
const readCooldown = (userId?: number) => {
  try {
    const v = Number(sessionStorage.getItem(storageKey(userId)));
    return Number.isFinite(v) && v > Date.now() ? v : null;
  } catch {
    return null;
  }
};
const writeCooldown = (userId: number | undefined, until: number) => {
  try {
    sessionStorage.setItem(storageKey(userId), String(until));
  } catch {
    /* 저장 불가 환경이면 화면 상태만 사용 */
  }
};

const formatRemaining = (ms: number) => {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const sec = String(total % 60).padStart(2, "0");
  return `${m}:${sec}`;
};

function EmailVerifySection() {
  const { principal } = usePrincipalState();
  const email = principal?.email ?? "";
  const userId = principal?.userId;
  const isVerified = principal?.emailVerified === true;

  // 재발송 가능 시각(ms). null 이면 바로 보낼 수 있음
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(() => readCooldown(userId));
  const [now, setNow] = useState(() => Date.now());

  // 대기 중일 때만 1초마다 남은 시간 갱신
  useEffect(() => {
    if (!cooldownUntil) return;
    const timer = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= cooldownUntil) setCooldownUntil(null);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownUntil]);

  const startCooldown = (ms: number) => {
    const until = Date.now() + ms;
    setNow(Date.now());
    setCooldownUntil(until);
    writeCooldown(userId, until);
  };

  // 그 밖의 실패(이미 인증됨, 발송 실패 등)는 전역 토스트가 백엔드 메시지로 표시
  const sendMut = useMutation({
    mutationFn: () => sendEmailCodeReq(email),
    onSuccess: () => {
      startCooldown(COOLDOWN_MS);
      toast.success("인증 메일을 보냈어요. 3분 안에 메일의 링크를 눌러 인증해주세요.");
    },
    onError: (err) => {
      // 3분 안에 다시 누른 경우: 서버가 알려준 남은 시간으로 카운트다운 맞춤
      if (err instanceof ApiError && err.code === "MAIL_COOLDOWN" && err.retryAfterSeconds) {
        startCooldown(err.retryAfterSeconds * 1000);
      }
    },
  });

  const remainingMs = cooldownUntil ? Math.max(0, cooldownUntil - now) : 0;
  const coolingDown = remainingMs > 0;

  return (
    <AccountInfoRow
      label={
        <div css={s.labelWithIcon}>
          <MdEmail size={18}/>
          <span>이메일 인증</span>
        </div>
      }
      action={
        isVerified ? (
          <span css={s.statusDone}>인증 완료</span>
        ) : (
          <button
            onClick={() => sendMut.mutate()}
            css={s.reserveBtn}
            disabled={!email || sendMut.isPending || coolingDown}
          >
            {sendMut.isPending
              ? "전송 중"
              : coolingDown
                ? `재전송 ${formatRemaining(remainingMs)}`
                : "전송"}
          </button>
        )
      }
    >
      <input value={email} css={s.input} disabled />
      {!isVerified && coolingDown && (
        <p css={s.helperText}>
          메일을 보냈어요. 3분 안에 메일의 링크를 눌러 인증해주세요.
        </p>
      )}
    </AccountInfoRow>
  );
}

export default EmailVerifySection;
