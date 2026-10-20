/** @jsxImportSource @emotion/react */
import { useCallback, useState } from "react";
import * as s from "./styles";
import Cropper, { type Area } from "react-easy-crop";
import { modalBtn } from "../CommonModal/modalButtons";

type Props = {
  open: boolean;
  imageSrc: string; //objectUrl
  onClose: () => void;
  onConfirm: (croppedAreaPixels: Area) => Promise<void>;
  title?: string;
};

function ImageCropModal({
  open,
  imageSrc,
  onClose,
  onConfirm,
  title = "프로필 설정",
}: Props) {
  // 크롭 좌표
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  // 배율
  const [zoom, setZoom] = useState(1);
  // 잘라낼 이미지 영역
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  // 이미지 저장중일 때 적용버튼 disabled
  const [isLoading, setIsLoading] = useState(false);

  // useCallback = 함수 참조가 고정됨
  // Cropper 내부 불필요한 업데이트를 줄일 수 있음.
  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels || isLoading) return;
    try {
      setIsLoading(true);
      await onConfirm(croppedAreaPixels); // 여기서 업로드 + patch 진행 - 비동기라서 위에 Promise로 바꿔줌
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <s.Overlay>
      <s.Modal width={520} role="dialog" aria-modal="true" aria-label={title}>
        <s.Header>
          <s.Title>{title}</s.Title>
          <s.CloseBtn type="button" onClick={onClose} aria-label="닫기">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </s.CloseBtn>
        </s.Header>

        <s.CropArea>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1} // 1:1 고정
            cropShape="round" // UI 원형(저장은 정사각)
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </s.CropArea>

        <s.Controls>

          <s.BtnRow>
            <button type="button" css={modalBtn("secondary")} onClick={onClose} disabled={isLoading}>
              취소
            </button>
            <button
              type="button"
              css={modalBtn("primary")}
              disabled={isLoading || !croppedAreaPixels}
              onClick={handleConfirm}
            >
              적용
            </button>
          </s.BtnRow>
        </s.Controls>
      </s.Modal>
    </s.Overlay>
  );
}

export default ImageCropModal;
