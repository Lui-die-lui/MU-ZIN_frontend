/** @jsxImportSource @emotion/react */
import * as s from "./styles";

import { patchMyProfileImgReq } from "../../../../apis/myPage/myPageApis";
import { getInitials } from "../../../../utils/myPageUtils";
import ImageCropModal from "../../../../components/common/ImageCropModal/ImageCropModal";
import { useProfileImageChange } from "../../../../hooks/useProfileImageChange";
import { IoCamera } from "react-icons/io5";
function ProfileHeaderCard() {
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
    // async 함수에서 return 안 하면 자동으로 Promise<void>가 돼서 타입이 맞음
    afterUpload: async (url) => {
      await patchMyProfileImgReq({ profileImgUrl: url });
    },
  });
  const name = principal?.username ?? "사용자";
  const email = principal?.email ?? "-";
  const avatarUrl = principal?.profileImgUrl ?? null;

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
          onClick={openFilePicker}
          disabled={isUploading}
          aria-label="프로필 사진 변경"
          title="프로필 사진 변경"
        >
          <s.EditIcon>
            <IoCamera fontSize={"18px"} />
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
        onClose={closeModal}
        onConfirm={confirmCrop}
        // title="프로필 사진 자르기"
      />
      {errorMsg && <s.StateText>{errorMsg}</s.StateText>}
    </s.Card>
  );
}

export default ProfileHeaderCard;
