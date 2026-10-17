/** @jsxImportSource @emotion/react */
import { useState } from "react";
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
  // 깨진 이미지 주소를 기억 -> src가 다른 이미지로 바뀌면 자동으로 다시 시도 (effect로 초기화할 필요 없음)
  const [erroredSrc, setErroredSrc] = useState<string | null>(null);

  const fallbackChar = name?.trim()?.[0]?.toUpperCase() ?? "?"; // 이미지 못찾을 경우?
  const showImg = !!src && erroredSrc !== src; // src가 있고 에러가 안났을 때 이미지를 보여줌
  return (
  <div css={s.circle(size)}>
    {showImg ? (
      <img
      src={src!}
      alt={alt}
      onError={() => setErroredSrc(src ?? null)}
      css={s.img}
      />
    ):(
      <div css={s.fallback(size)}>{fallbackChar}</div>
    )}
  </div>
  );
}

export default ProfileAvatar;
