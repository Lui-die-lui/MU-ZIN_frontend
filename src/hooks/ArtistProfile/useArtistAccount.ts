import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyArtistProfileReq,
  updateApprovedProfileReq,
} from "../../apis/artist/artistApi";
import { useEffect, useMemo, useState } from "react";
import type { ArtistProfileUpsertRequest } from "../../Types/artistApplyTypes";

function useArtistAccount() {
  const qc = useQueryClient();

  // 아티스트 기존 프로필 값
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["artistProfile", "me"],
    queryFn: async () => {
      const res = await getMyArtistProfileReq();
      return res.data.data; // ArtistProfileResponse | null
    },
  });

  const [bio, setBio] = useState("");
  const [career, setCareer] = useState("");

  // 컴포넌트 처음 렌더링 될 때 해당 값을 set 해줌 - 없으면 공백
  useEffect(() => {
    if (!profile) return;
    setBio(profile.bio ?? "");
    setCareer(profile.career ?? "");
  }, [profile?.artistProfileId]);

  // 입력한 값이 서버에서 받아온 원래 값이랑 달라졌는지 체크
  const isDirty = useMemo(() => {
    if (!profile) return false;
    return (
      (bio ?? "") !== (profile.bio ?? "") ||
      (career ?? "") !== (profile.career ?? "")
    );
  }, [profile, bio, career]);

  // 바뀐 값을 바로 적용시킴
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error("아티스트 프로필이 없습니다.");

      const body: ArtistProfileUpsertRequest = {
        bio,
        career,
        majorName: profile.majorName, // 원래 값을 받아와서 변경 잠금
      };

      const res = await updateApprovedProfileReq(body); // 정보 업데이트
      return res.data.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["artistProfile", "me"] });
      await qc.invalidateQueries({ queryKey: ["principal"] });
      alert("저장이 완료되었습니다.");
    },
    onError: () => {
      alert("저장 실패"); // 이거 나중에 서버 메시지 받아올거면 생각해보기
    },
  });

  return {
    profile,
    isLoading,
    isError,
    bio,
    setBio,
    career,
    setCareer,
    isDirty,
    save: () => saveMutation.mutate(),
    isSaving: saveMutation.isPending,
  };
}

export default useArtistAccount;
