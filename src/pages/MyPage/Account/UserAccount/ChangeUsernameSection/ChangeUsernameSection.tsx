import { useEffect, useState } from "react";
import { usePrincipalState } from "../../../../../stores/usePrincipalState";
import { useMutation } from "@tanstack/react-query";
import { patchMyUsernameReq } from "../../../../../apis/user/userApis";
import { ContentItem } from "../../styles";

function ChangeUserSection() {
  const { principal, updatePrincipal } = usePrincipalState();
  const current = principal?.username ?? "";
  const [username, setUsername] = useState(current);
  const [message, setMessage] = useState<string | null>(null);

  // principal이 갱신되면 input도 동기화
  useEffect(() => {
    setUsername(current);
  }, [current]);

  const mut = useMutation({
    mutationFn: (next: string) => patchMyUsernameReq(next),
    onSuccess: (res, next) => {
      const { status, message, data } = res.data; // apiRespDto 생각하면 됨

      if (status !== "success") {
        setMessage(message ?? "이미 사용중인 이름입니다.");
        return;
      }

      // 서버가 username을 다시 내려주면 그 값 우선, 아니면 내가 보낸 값 반영
      const saved = data?.username ?? next;

      updatePrincipal({ username: saved });
      setMessage("유저명 변경 완료");
    },

    onError: () => {
      setMessage("유저명 변경 실패");
    },
  });

  const next = username.trim(); // 공백 제거

  // 이름 길이 검증
  const validLen = next.length >= 2 && next.length <= 30;
  // 이름이 확실히 변경
  const changed = next !== current;
  const canSave = validLen && changed && !mut.isPending;

  const onSave = () => {
    console.log("[USERNAME] onSave", {
      current,
      username,
      next,
      validLen,
      changed,
      canSave,
    });
    setMessage(null);
    if (!canSave) return;
    mut.mutate(next);
  };

  return (
    <ContentItem>
      <p>이름</p>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        // placeholder={current}
      />
      <button onClick={onSave} disabled={!canSave}>
        {mut.isPending ? "저장중" : "저장"}
      </button>
      {!validLen && <p>이름은 2~30자 내로 입력해주세요.</p>}
      {message && <p>{message}</p>}
    </ContentItem>
  );
}

export default ChangeUserSection;
