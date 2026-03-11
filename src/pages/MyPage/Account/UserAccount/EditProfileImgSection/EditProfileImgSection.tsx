/** @jsxImportSource @emotion/react */
import { patchMyProfileImgReq } from "../../../../../apis/myPage/myPageApis";
import ImageCropModal from "../../../../../components/common/ImageCropModal/ImageCropModal";
import ProfileAvatar from "../../../../../components/common/ProfileAvatar/ProfileAvatar";
import { useProfileImageChange } from "../../../../../hooks/useProfileImageChange";
import * as s from "./styles";

import { IoCamera } from "react-icons/io5";
// import ProfileAvatar from "../../../../components/common/ProfileAvatar/ProfileAvatar";
// import { useProfileImageChange } from "../../../../hooks/useProfileImageChange";
// import { patchMyProfileImgReq } from "../../../../apis/myPage/myPageApis";
// import ImageCropModal from "../../../../components/common/ImageCropModal/ImageCropModal";

function EditProfileImgSection() {
  const {
    principal,
    isUploading,
    fileRef,
    openFilePicker,
    onPickFile,
    open,
    imageSrc,
    closeModal,
    confirmCrop,
    errorMsg,
  } = useProfileImageChange({
    afterUpload: async (url) => {
      await patchMyProfileImgReq({ profileImgUrl: url });
    },
  });
  const avatarUrl = principal?.profileImgUrl ?? null;
  const name = principal?.username ?? "";
  return (
      <>
      <div css={s.infoRow}>
        <div css={s.infoLabel}>
          <IoCamera size={18} />
          <span>프로필 사진</span>
        </div>

        <div css={s.infoContent}>
          <p css={s.infoText}>사진 클릭 시 프로필 이미지 변경</p>
          {errorMsg && <p css={s.errorText}>{errorMsg}</p>}
        </div>

        <div css={s.infoAction}>
          <button
            type="button"
            css={s.avatarButton}
            onClick={openFilePicker}
            disabled={isUploading}
            aria-label="프로필 사진 변경"
          >
            <ProfileAvatar src={avatarUrl} name={name} size={80} />
            {/* <span css={s.avatarHint}>
              {isUploading ? "업로드 중..." : "사진 변경"}
            </span> */}
          </button>
        </div>
      </div>

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
        onClose={closeModal}
        onConfirm={confirmCrop}
      />
    </>
  );
}

export default EditProfileImgSection;
