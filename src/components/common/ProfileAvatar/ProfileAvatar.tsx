/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import * as s from "./styles";

type AvatarProps = {
  src?: string | null;
  name?: string;
  alt?: string;
  size?: number;
};
function ProfileAvatar({
  src,
  name,
  alt = "프로필",
  size = 44,
}: AvatarProps) {
  // 이미지 깨졌을 때
  const [imgError, setImgError] = useState(false);

  // src가 바뀌면 에ㅅ러 상태 초기화 (다른 사람/다른 이미지로 바뀔 때 중요함)
  useEffect(() => {
    setImgError(false);
  }, [src]);

  const fallbackChar = name?.trim()?.[0]?.toUpperCase() ?? "?"; // 이미지 못찾을 경우?
  const showImg = !!src && !imgError; // src가 있고 에러가 안났을 때 이미지를 보여줌
  return (
  <div css={s.circle(size)}>
    {showImg ? (
      <img
      src={src!}
      alt={alt}
      onError={() => setImgError(true)}
      css={s.img}
      />
    ):(
      <div css={s.fallback}>{fallbackChar}</div>
    )}
  </div>
  );
}

export default ProfileAvatar;
