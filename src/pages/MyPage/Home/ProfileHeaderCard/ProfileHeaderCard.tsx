import React, { useRef, useState } from "react";
import { usePrincipalState } from "../../../../stores/usePrincipalState";
import { useFirebaseUpload } from "../../../../hooks/useFirebaseUpload";
import type { Area } from "react-easy-crop";
import { getCroppedFile } from "../../../../utils/imageUtils";
import { patchMyProfileImgReq } from "../../../../apis/myPage/myPageApis";

// 업로드되는 파일 확장자 및 허용 파일 크기
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

function ProfileHeaderCard() {
  const fileRef = useRef<HTMLInputElement>(null);

  const { principal, updatePrincipal } = usePrincipalState();
  const { uploadFile, isUploading } = useFirebaseUpload();

  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const name = principal?.username ?? "사용자";
  const email = principal?.email ?? "-";
  const avatarUrl = principal?.profileImgUrl ?? null;

  const onClickUpdate = () => {
    if (isUploading) return;
    fileRef.current?.click();
  };

  // 사진 선택시 검증
  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("JPG/PNG/WEBP 이미지 파일만 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_SIZE_MB) {
      alert(`이미지 용량은 ${MAX_SIZE_MB}MB 이하로 올려주세요.`);
      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setOpen(true);

    // 동일 파일 다시 선택 가능
    e.target.value = "";
  };

  // 닫았을 때 프로필 바뀐거 반영 안됨
  const onClose = () => {
    setOpen(false);
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc("");
  };

  const onConfirm = async (croppedAreaPixels: Area) => {
    if (!principal?.userId) return;

    try {
      // 크롭 결과는 JPG 512x512로 통일(프로필 최적)
      const croppedFile = await getCroppedFile({
        imageSrc,
        crop: croppedAreaPixels,
        outputSize: 512,
        mimeType: "image/jpeg",
        quality: 0.92,
      });

      // const url = await uploadFile(croppedFile, `profiles/${principal.userId}`)

      // setProfileImgUrl(url)
      // await patchMyProfileImgReq({profileImgUrl: url})
      // onClose();
    } catch (error) {
      alert(error);
    }
  };

  return <div></div>;
}

export default ProfileHeaderCard;
