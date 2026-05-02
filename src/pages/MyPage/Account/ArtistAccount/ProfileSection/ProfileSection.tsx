

// export default ProfileSection;
/** @jsxImportSource @emotion/react */
import useArtistAccount from "../../../../../hooks/ArtistProfile/useArtistAccount";
import { useArtistApplyFormStore } from "../../../../../stores/useArtistApplyFormStore";
import RegionSection from "../RegionSection/RegionSection";
import * as s from "./styles";

function ProfileSection() {
  const { profile, isLoading, isError, isDirty, save, isSaving } =
    useArtistAccount();

  const bio = useArtistApplyFormStore((state) => state.bio);
  const career = useArtistApplyFormStore((state) => state.career);
  const setField = useArtistApplyFormStore((state) => state.setField);

  if (isLoading) return <div css={s.statusText}>로딩중...</div>;
  if (isError) return <div css={s.statusText}>불러오기에 실패했습니다.</div>;
  if (!profile) return <div css={s.statusText}>아티스트 프로필이 없습니다.</div>;

  return (
    <section css={s.section}>
      <div css={s.sectionHeader}>
        <div>
          <h3 css={s.sectionTitle}>소개 및 경력</h3>
          <p css={s.sectionDesc}>
            아티스트 소개, 경력, 활동 지역을 관리하세요.
          </p>
        </div>
      </div>

      <div css={s.content}>
        <div css={s.fieldGroup}>
          <div css={s.labelArea}>
            <label css={s.label}>전공</label>
            <p css={s.labelDesc}>승인 후 변경 불가</p>
          </div>

          <div css={s.inputArea}>
            <input
              value={profile.majorName ?? ""}
              css={s.input}
              readOnly
              aria-readonly
            />
            <p css={s.helperText}>승인 후 전공은 변경할 수 없어요.</p>
          </div>
        </div>

        <div css={s.fieldGroup}>
          <div css={s.labelArea}>
            <label css={s.label}>소개</label>
            <p css={s.labelDesc}>수업 방향과 강점</p>
          </div>

          <div css={s.inputArea}>
            <textarea
              value={bio}
              css={s.textarea}
              placeholder="레슨 스타일, 강점, 수업 방향을 적어주세요."
              onChange={(e) => setField("bio", e.target.value)}
            />
          </div>
        </div>

        <div css={s.fieldGroup}>
          <div css={s.labelArea}>
            <label css={s.label}>경력</label>
            <p css={s.labelDesc}>활동 이력</p>
          </div>

          <div css={s.inputArea}>
            <textarea
              value={career}
              css={s.textarea}
              placeholder="공연, 콩쿠르, 강의 이력 등을 적어주세요."
              onChange={(e) => setField("career", e.target.value)}
            />
          </div>
        </div>

        <div css={s.divider} />

        <div css={s.regionBlock}>
          <div css={s.sectionHeader}>
            <h3 css={s.sectionTitle}>지역 정보</h3>
            <p css={s.sectionDesc}>
              스튜디오 주소와 서비스 가능 지역을 설정하세요.
            </p>
          </div>

          <RegionSection />
        </div>

        <div css={s.actionRow}>
          <button
            type="button"
            disabled={!isDirty || isSaving}
            css={s.saveButton(!isDirty || isSaving)}
            onClick={save}
          >
            {isSaving ? "저장중..." : "프로필 저장"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProfileSection;