/** @jsxImportSource @emotion/react */
import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as s from "./styles";
import UnfollowDialog from "./UnfollowDialog";
import { useToggleFollow } from "../../hooks/artistSearch/useArtistFollow";
import { usePrincipalState } from "../../stores/usePrincipalState";
import { getErrorMessage } from "../../utils/errorUtils";
import { toast } from "../../stores/useToastStore";

type Props = {
  artistProfileId: number;
  artistName: string;
  profileImgUrl?: string | null;
  following: boolean;
  // md: 아티스트 페이지 / sm: 카드
  size?: "md" | "sm";
};

// 인스타그램 같은 팔로우 버튼 (즐겨찾기처럼 사용, 새 레슨 알림 없음)
// - 팔로우 전: 검정 "팔로우" -> 누르면 바로 팔로우
// - 팔로우 중: 회색 "팔로잉" -> 누르면 "팔로우를 취소하시겠어요?" 확인 후 취소
// - 누르는 즉시 바뀌고 실패하면 되돌림. 서버 값이 바뀌면 부모가 key 로 새로 만들어 맞춤
function FollowButton({ artistProfileId, artistName, profileImgUrl, following, size = "md" }: Props) {
  const isAuthenticated = usePrincipalState((st) => st.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();
  const toggleM = useToggleFollow();

  const [on, setOn] = useState(following);
  const [confirming, setConfirming] = useState(false);

  const change = async (next: boolean) => {
    setOn(next);
    try {
      const res = await toggleM.mutateAsync({ artistProfileId, follow: next });
      setOn(res.following);
    } catch (err) {
      setOn(!next);
      toast.error(getErrorMessage(err, "팔로우를 바꾸지 못했어요."));
    }
  };

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/signin", { state: { from: location } });
      return;
    }
    if (toggleM.isPending) return;
    if (on) setConfirming(true);
    else void change(true);
  };

  const closeConfirm = useCallback(() => setConfirming(false), []);

  return (
    <>
      <button
        type="button"
        css={s.followButton(on, size)}
        aria-pressed={on}
        aria-label={on ? `${artistName} 팔로잉 (누르면 팔로우 취소)` : `${artistName} 팔로우`}
        onClick={onClick}
      >
        {on ? "팔로잉" : "팔로우"}
      </button>
      {confirming && (
        <UnfollowDialog
          name={artistName}
          profileImgUrl={profileImgUrl}
          onCancel={closeConfirm}
          onConfirm={() => {
            setConfirming(false);
            void change(false);
          }}
        />
      )}
    </>
  );
}

export default FollowButton;
