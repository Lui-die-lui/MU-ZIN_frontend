import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { usePrincipalState } from "../stores/usePrincipalState";
import { useFirebaseUpload } from "./useFirebaseUpload";
import type { Area } from "react-easy-crop";
import { getCroppedFile } from "../utils/imageUtils";


// 업로드되는 파일 확장자 및 허용 파일 크기
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

type Options = {
  outputSize?: number; // default 512
  mimeType?: "image/jpeg" | "image/png" | "image/webp";
  quality?: number; // jpeg 품질
  uploadPathPrefix?: string; // default "profiles"
  afterUpload?: (url: string) => Promise<void> | void; // 저장 옵션
};

export function useProfileImageChange(options: Options = {}) {
  const {
    outputSize = 512,
    mimeType = "image/jpeg",
    quality = 0.92,
    uploadPathPrefix = "profiles",
  } = options;

  const fileRef = useRef<HTMLInputElement>(null);

  const { principal, updatePrincipal } = usePrincipalState();
  const { uploadFile, isUploading } = useFirebaseUpload();

  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const openFilePicker = () => {
    if (isUploading) return;
    fileRef.current?.click();
  };

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "JPG/PNG/WEBP 이미지 파일만 업로드할 수 있습니다.";
    }
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_SIZE_MB) {
      return `이미지 용량은 ${MAX_SIZE_MB}MB 이하로 올려주세요.`;
    }
    return null;
  };

  const onPickFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 검증 못넘어가면 사진 안바꿔줌
    const msg = validateFile(file);
    if (msg) {
      setErrorMsg(msg);
      e.target.value = "";
      return;
    }

    // 이미지 파일 크롭 모달로 띄워줌
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setOpen(true);

    // 동일 파일 다시 선택 가능
    e.target.value = "";
  };

  // 저장 없이 닫기만 하면 반영 안됨
  const closeModal = () => {
    setOpen(false);
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc("");
  };

  // 언마운트 시에도 objectURL 정리
  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  const confirmCrop = async (croppedAreaPixels: Area) => {

    if (!principal?.userId) return;
    // if (!uid) {
    //   setErrorMsg("로그인이 필요합니다.");
    //   return;
    // }

    try {
      const croppedFile = await getCroppedFile({
        imageSrc,
        crop: croppedAreaPixels,
        outputSize,
        mimeType,
        quality,
      });

      const url = await uploadFile(
        croppedFile,
        `${uploadPathPrefix}/${principal.userId}`,
        // `${uploadPathPrefix}/${uid}`,
      );
      // 저장
      await options.afterUpload?.(url);
      // UI 즉시 반영
      updatePrincipal({ profileImgUrl: url });
      closeModal();
    } catch (error: unknown) {
      console.error(error);
      setErrorMsg(
        error instanceof Error ? error.message : "프로필 이미지 저장 실패",
      );
    }
  };

  return {
    // data
    principal,
    isUploading,
    open,
    imageSrc,
    errorMsg,

    //refs/handlers
    fileRef,
    openFilePicker,
    onPickFile,
    closeModal,
    confirmCrop,

    clearError: () => setErrorMsg(null),
  };
}
