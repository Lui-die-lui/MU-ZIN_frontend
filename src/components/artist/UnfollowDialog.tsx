/** @jsxImportSource @emotion/react */
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import * as s from "./styles";
import ProfileAvatar from "../common/ProfileAvatar/ProfileAvatar";

type Props = {
  name: string;
  profileImgUrl?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

// 인스타그램처럼 팔로우 취소 전에 한 번 묻는 창 (사진 + 이름 + [팔로우 취소] / [취소])
// body 로 띄움: 카드처럼 transform 이 걸린 요소 안에서는 position: fixed 가 화면 기준이 아니게 됨
function UnfollowDialog({ name, profileImgUrl, onConfirm, onCancel }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prevFocus?.focus(); // 닫히면 누르던 버튼으로 초점 복귀
    };
  }, [onCancel]);

  return createPortal(
    <div
      css={s.dialogOverlay}
      onClick={(e) => {
        e.stopPropagation();
        onCancel();
      }}
    >
      <div
        css={s.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="unfollow-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div css={s.dialogHead}>
          <ProfileAvatar src={profileImgUrl} name={name} size={72} />
          <p id="unfollow-title" css={s.dialogText}>
            <strong>{name}</strong>님의 팔로우를 취소하시겠어요?
          </p>
        </div>
        <button type="button" css={s.dialogDanger} onClick={onConfirm}>
          팔로우 취소
        </button>
        <button type="button" ref={cancelRef} css={s.dialogCancel} onClick={onCancel}>
          취소
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default UnfollowDialog;
