/** @jsxImportSource @emotion/react */
import * as as from "./styles";
import * as s from "./ArtistAccount/styles";
import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import useArtistAccount, {
  BIO_MAX,
  CAREER_MAX,
  MAX_SERVICE_REGIONS,
  MAX_STYLE_TAGS,
  type ArtistSection,
} from "../../../hooks/ArtistProfile/useArtistAccount";
import MainRegionField from "./ArtistAccount/RegionSection/MainRegionField";
import ServiceRegionField from "./ArtistAccount/RegionSection/ServiceRegionField";
import ApplyInstrumentPicker from "../Artist/ArtistApply/ApplyInstrumentPicker";
import SelectedInstrumentChips from "../Artist/ArtistApply/SelectedInstrumentChips";
import MultiSelectDropdown from "../../../components/common/MultiSelectDropdown/MultiSelectDropdown";
import SelectedChips from "../../../components/common/SelectedChips/SelectedChips";
import type { LessonStyleTagResponse } from "../../../Types/lessonTypes";
import { useArtistApplyFormStore } from "../../../stores/useArtistApplyFormStore";

// 마이페이지 > 인증 및 개인정보 > 아티스트 프로필
// "내 정보" 화면과 같은 구성: 한 카드 안에 [이름 | 입력 | 저장] 행 (아이콘은 없음), 행마다 따로 저장하고 결과는 입력칸 아래에 표시
function ArtistAccountPage() {
  const ed = useArtistAccount();
  const instrumentIds = useArtistApplyFormStore((st) => st.instrumentIds);
  const serviceCount = useArtistApplyFormStore((st) => st.serviceRegions.length);

  // 저장하지 않은 행이 있으면 새로고침/탭 닫기 전에 확인
  useEffect(() => {
    if (!ed.isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [ed.isDirty]);

  if (ed.isLoading) return <div css={s.centerState}>프로필을 불러오는 중...</div>;
  if (ed.isError || !ed.profile) {
    return (
      <div css={s.centerState} role="alert">
        프로필을 불러오지 못했어요.
        <button type="button" css={as.reserveBtn} onClick={() => ed.refetch()}>
          다시 불러오기
        </button>
      </div>
    );
  }

  const { profile } = ed;
  const usedInLessons = [...ed.lessonsByInst.entries()].filter(([id]) => instrumentIds.includes(id));

  // 행 하나 (AccountInfoRow 와 같은 모양 + 저장 버튼/결과 문구)
  const Row = ({ k, label, children }: { k?: ArtistSection; label: string; children: ReactNode }) => {
    const msg = k ? ed.messages[k] : undefined;
    const saving = !!k && ed.savingKey === k;
    return (
      <div css={s.row} data-row={k ?? "major"}>
        <div css={[as.labelWithIcon, s.rowLabel]}>
          <span>{label}</span>
        </div>
        <div css={s.rowContent}>
          {children}
          {msg && (
            <p css={msg.type === "success" ? as.successText : as.errorText} role={msg.type === "error" ? "alert" : "status"}>
              {msg.text}
            </p>
          )}
        </div>
        <div css={s.rowAction}>
          {k && (
            <button
              type="button"
              css={as.reserveBtn}
              disabled={!ed.dirty[k] || ed.savingKey !== null}
              onClick={() => ed.save(k)}
            >
              {saving ? "저장중" : "저장"}
            </button>
          )}
        </div>
      </div>
    );
  };

  const onChangeStyles = (ids: number[]) => {
    const unique = Array.from(new Set(ids));
    if (unique.length > MAX_STYLE_TAGS) return; // 5개를 넘는 선택은 무시 (아래 안내 문구로 알림)
    ed.setStyleIds(unique);
  };

  return (
    <div css={as.page}>
      <div css={[as.header, s.headerRow]}>
        <div>
          <h1 css={as.title}>아티스트 프로필</h1>
          <p css={as.desc}>수강생에게 보이는 내 소개와 활동 정보를 관리하세요.</p>
        </div>
        <Link css={s.profileLink} to={`/artists/${profile.artistProfileId}`}>
          공개 프로필 보기 →
        </Link>
      </div>

      <div css={as.card}>
        {Row({
          label: "전공",
          children: (
            <>
              <div css={s.readonlyValue}>{profile.majorName || "-"}</div>
              <p css={as.helperText}>승인 후에는 바꿀 수 없어요.</p>
            </>
          ),
        })}

        {Row({
          k: "bio",
          label: "소개",
          children: (
            <>
              <textarea
                id="artist-bio"
                aria-label="소개"
                css={s.textarea(ed.messages.bio?.type === "error")}
                rows={4}
                maxLength={BIO_MAX}
                value={ed.bio}
                placeholder="예: 처음 악기를 잡는 분도 부담 없이 시작할 수 있게, 기초 자세부터 차근차근 알려드려요."
                onChange={(e) => ed.setBio(e.target.value)}
              />
              <div css={s.metaLine}>
                <span>수강생이 가장 먼저 보는 내용이에요.</span>
                <span>
                  {ed.bio.length}/{BIO_MAX}
                </span>
              </div>
            </>
          ),
        })}

        {Row({
          k: "career",
          label: "경력",
          children: (
            <>
              <textarea
                id="artist-career"
                aria-label="경력"
                css={s.textarea(ed.messages.career?.type === "error")}
                rows={5}
                maxLength={CAREER_MAX}
                value={ed.career}
                placeholder={"예:\n- ○○대학교 음악대학 졸업\n- 개인 레슨 5년"}
                onChange={(e) => ed.setCareer(e.target.value)}
              />
              <div css={s.metaLine}>
                <span>공연·콩쿠르·강의 이력 등</span>
                <span>
                  {ed.career.length}/{CAREER_MAX}
                </span>
              </div>
            </>
          ),
        })}

        {Row({
          k: "main",
          label: "스튜디오 주소",
          children: (
            <>
              <MainRegionField hideHeader onEdit={() => ed.touch("main")} />
              <p css={as.helperText}>직접 수업하는 학원·스튜디오가 있을 때만 등록하세요.</p>
            </>
          ),
        })}

        {Row({
          k: "service",
          label: "서비스 지역",
          children: (
            <>
              <ServiceRegionField hideHeader onEdit={() => ed.touch("service")} />
              <div css={s.metaLine}>
                <span>방문·출장 레슨이 가능한 지역이에요.</span>
                <span>
                  {serviceCount}/{MAX_SERVICE_REGIONS}
                </span>
              </div>
            </>
          ),
        })}

        {Row({
          k: "instruments",
          label: "악기",
          children: (
            <div onClickCapture={() => ed.touch("instruments")} style={{ display: "grid", gap: 10 }}>
              <ApplyInstrumentPicker disabled={ed.savingKey === "instruments"} />
              <SelectedInstrumentChips disabled={ed.savingKey === "instruments"} />
              {usedInLessons.length > 0 ? (
                <p css={s.inUseNote}>
                  레슨에서 쓰는 악기:{" "}
                  {usedInLessons.map(([id, v], i) => (
                    <span key={id}>
                      {i > 0 && ", "}
                      <b>{v.instName}</b> ({v.titles.length}개 레슨)
                    </span>
                  ))}{" "}
                  · 빼려면 레슨의 악기를 먼저 바꿔주세요.
                </p>
              ) : (
                <p css={as.helperText}>레슨을 만들 때 이 중에서 고르게 돼요.</p>
              )}
            </div>
          ),
        })}

        {Row({
          k: "styles",
          label: "레슨 스타일",
          children: (
            <>
              <MultiSelectDropdown<LessonStyleTagResponse>
                label="스타일 선택"
                selectedCountLabel={(n) => `스타일 ${n}개 선택됨`}
                searchPlaceholder="스타일 검색 (예: 체계적)"
                items={ed.allTags}
                isLoading={ed.stylesLoading}
                getId={(t) => t.lessonStyleTagId}
                getLabel={(t) => t.styleName}
                selectedIds={ed.styleIds}
                onChangeSelectedIds={onChangeStyles}
              />
              <SelectedChips<LessonStyleTagResponse>
                disabled={ed.savingKey === "styles"}
                items={ed.selectedStyles}
                getKey={(t) => t.lessonStyleTagId}
                getLabel={(t) => t.styleName}
                onRemove={(t) => ed.setStyleIds(ed.styleIds.filter((id) => id !== t.lessonStyleTagId))}
                title="눌러서 빼기"
              />
              <div css={s.metaLine}>
                <span>
                  {ed.styleIds.length >= MAX_STYLE_TAGS
                    ? `최대 ${MAX_STYLE_TAGS}개를 모두 골랐어요. 바꾸려면 하나를 빼주세요.`
                    : "수강생이 검색할 때 쓰여요."}
                </span>
                <span>
                  {ed.styleIds.length}/{MAX_STYLE_TAGS}
                </span>
              </div>
            </>
          ),
        })}
      </div>
    </div>
  );
}

export default ArtistAccountPage;
