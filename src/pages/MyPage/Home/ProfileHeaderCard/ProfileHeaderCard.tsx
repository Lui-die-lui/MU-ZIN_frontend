/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import React, { useRef, useState } from "react";
import { usePrincipalState } from "../../../../stores/usePrincipalState";
import { useFirebaseUpload } from "../../../../hooks/useFirebaseUpload";
import type { Area } from "react-easy-crop";
import { getCroppedFile } from "../../../../utils/imageUtils";
import { patchMyProfileImgReq } from "../../../../apis/myPage/myPageApis";
import { IoMdSettings } from "react-icons/io";
import { getInitials } from "../../../../utils/myPageUtils";
import ImageCropModal from "../../../../components/common/ImageCropModal/ImageCropModal";

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

      const url = await uploadFile(croppedFile, `profiles/${principal.userId}`);

      updatePrincipal({ profileImgUrl: url });

      await patchMyProfileImgReq({ profileImgUrl: url });
      onClose();
    } catch (error: unknown) {
      console.error(error);
      setErrorMsg(
        error instanceof Error ? error.message : "프로필 이미지 저장 실패"
      );
    }
  };

  return (
    <s.Card>
      <s.AvatarWrap>
        <s.AvatarCircle>
          {avatarUrl ? (
            <s.AvatarImg src={avatarUrl} alt="프로필 이미지" />
          ) : (
            // 없으면 이름 보여주는데 지금 이름을 이메일로 가져와서 의미없는듯 한번 생각해보기
            <s.AvatarText>{getInitials(name)}</s.AvatarText>
          )}
        </s.AvatarCircle>

        <s.EditPicBtn
          type="button"
          onClick={onClickUpdate}
          disabled={isUploading}
          aria-label="프로필 사진 변경"
          title="프로필 사진 변경"
        >
          <s.EditIcon>
            <IoMdSettings fontSize={"18px"}/>
          </s.EditIcon>
        </s.EditPicBtn>
      </s.AvatarWrap>

      {/* 읽기 전용 - 편집 ui 없음 / 구글 참고 */}
      <s.UserName>{name}</s.UserName>
      <s.Email>{email}</s.Email>

        <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={onPickFile}
      />

      <ImageCropModal
        open={open}
        imageSrc={imageSrc}
        onClose={onClose}
        onConfirm={onConfirm}
        title="프로필 사진 자르기"
      />
    </s.Card>
  );
}

export default ProfileHeaderCard;
