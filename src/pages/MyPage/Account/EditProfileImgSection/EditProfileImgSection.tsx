/** @jsxImportSource @emotion/react */
import * as s from "../styles";

import { IoCamera } from "react-icons/io5";
import ProfileAvatar from "../../../../components/common/ProfileAvatar/ProfileAvatar";
import { useProfileImageChange } from "../../../../hooks/useProfileImageChange";
import { patchMyProfileImgReq } from "../../../../apis/myPage/myPageApis";
import ImageCropModal from "../../../../components/common/ImageCropModal/ImageCropModal";

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
  const avataUrl = principal?.profileImgUrl ?? null;
  const name = principal?.username ?? "";
  return (
    <div>
      <s.SubContainer onClick={openFilePicker}>
        <s.ContentItem>
          <IoCamera fontSize={"18px"} />
          <p>프로필 사진</p>
        </s.ContentItem>
        <ProfileAvatar src={avataUrl} name={name} size={80} />
      </s.SubContainer>
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
    </div>
  );
}

export default EditProfileImgSection;
