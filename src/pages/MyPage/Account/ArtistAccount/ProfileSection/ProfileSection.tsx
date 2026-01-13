import React from "react";
import useArtistAccount from "../../../../../hooks/ArtistProfile/useArtistAccount";

function ProfileSection() {
  const {
    profile,
    isLoading,
    isError,
    bio,
    setBio,
    career,
    setCareer,
    isDirty,
    save,
    isSaving,
  } = useArtistAccount();

  if (isLoading) return <div>로딩중...</div>;
  if (isError) return <div>불러오기에 실패했습니다.</div>;
  if (!profile) return <div>아티스트 프로필이 없습니다.</div>;

  return (
    <section>
      <h3>소개 / 경력</h3>

      <div>
        <label>전공(승인 후 변경 불가)</label>
        {/* 이거 꼭 인풋으로 넣어야하나 그럼...? */}
        <input value={profile.majorName ?? ""} readOnly />
      </div>

      <div>
        <label>소개</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>

      <div>
        <label>경력</label>
        <textarea value={career} onChange={(e) => setCareer(e.target.value)} />
      </div>

      <button disabled={!isDirty || isSaving} onClick={save}>
        {isSaving ? "저장중..." : "저장"}
      </button>
    </section>
  );
}

export default ProfileSection;
