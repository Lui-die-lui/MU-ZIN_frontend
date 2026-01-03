/** @jsxImportSource @emotion/react */
import { useCallback, useState } from "react";
import * as s from "./styles";
import Cropper, { type Area } from "react-easy-crop";

type Props = {
  open: boolean;
  imageSrc: string; //objectUrl
  onClose: () => void;
  onConfirm: (croppedAreaPixels: Area) => void;
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

  // useCallback = 함수 참조가 고정됨
  // Cropper 내부 불필요한 업데이트를 줄일 수 있음.
  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  if (!open) return null;
  return (
    <s.Overlay>
      <s.Modal>
        <s.Header>
          <s.Title>{title}</s.Title>
          <s.CloseBtn type="button" onClick={onClose} aria-label="닫기">
            ✕
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
          <label>
            줌
            <s.Range
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </label>

          <s.BtnRow>
            <s.Btn type="button" onClick={onClose}>
              취소
            </s.Btn>
            <s.PrimaryBtn
              type="button"
              onClick={() => croppedAreaPixels && onConfirm(croppedAreaPixels)}
            >
              적용
            </s.PrimaryBtn>
          </s.BtnRow>
        </s.Controls>
      </s.Modal>
    </s.Overlay>
  );
}

export default ImageCropModal;
