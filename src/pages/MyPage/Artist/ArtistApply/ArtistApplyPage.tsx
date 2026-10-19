/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import * as fs from "../ArtistManage/common/formStyles";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useMyArtistProfile } from "../../../../hooks/ArtistProfile/useMyArtistProfile";
import { useArtistApplyFormStore } from "../../../../stores/useArtistApplyFormStore";
import { useArtistDraftSaveMutation } from "../../../../hooks/ArtistProfile/useArtistdraftSaveMutation";
import { useArtistSubmitMutation } from "../../../../hooks/ArtistProfile/useArtistSubmitMutation";
import ApplyInstrumentPicker from "./ApplyInstrumentPicker";
import SelectedInstrumentChips from "./SelectedInstrumentChips";
import MainRegionField from "../../Account/ArtistAccount/RegionSection/MainRegionField";
import ServiceRegionField from "../../Account/ArtistAccount/RegionSection/ServiceRegionField";
import { usePrincipalState } from "../../../../stores/usePrincipalState";
import type { ArtistStatus } from "../../../../Types/auth";
import ConfirmModal from "../../../../components/common/ConfirmModal/ConfirmModal";
import { toast } from "../../../../stores/useToastStore";
import { normMain, normServices, sameIds } from "../../../../utils/artistProfileCompare";

// 서버 검증과 같은 기준 (ArtistProfileServiceImpl)
const BIO_MAX = 255;
const CAREER_MAX = 2000;
const MAJOR_MAX = 50;
const NON_MAJOR = "비전공";

const CAREER_EXAMPLE = `- 악기 경력: 피아노 10년 (독학 3년 + 학원 7년)
- 활동: 직장인 밴드 키보드 3년, 교회 반주 5년
- 가르친 경험: 초등학생 개인 레슨 2년 (주 3회)
- 그 밖에: 실용음악학원 수료, 지역 콩쿠르 입상`;

type Errors = Partial<Record<"bio" | "major" | "career" | "service" | "instruments", string>>;

// 마이페이지 > 아티스트 전환 신청
// 예전: 라벨 안에 입력칸이 섞인 날것 폼(전공 라벨 안에 지역 입력까지 들어 있어 클릭이 전공 칸으로 전달), 제출 버튼은 조건을 다 채울 때까지 이유 없이 비활성
// 지금: 기본 정보 → 경력 → 활동 지역 → 레슨 악기 카드 + 아래 고정 [필수 항목 진행 · 임시 저장 · 제출하기]
function ArtistApplyPage() {
  const { data: profile, isLoading, isError } = useMyArtistProfile();
  const { principal } = usePrincipalState();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { bio, career, majorName, instrumentIds, mainRegion, serviceRegions, hydrateFormProfile, setField } =
    useArtistApplyFormStore();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (profile) hydrateFormProfile(profile); // 이전에 임시 저장한 내용이 있으면 채워줌
  }, [profile, hydrateFormProfile]);

  const draftMut = useArtistDraftSaveMutation();
  const submitMut = useArtistSubmitMutation();

  // 서버에 저장된 내용과 다른지 (임시 저장 버튼 / 나가기 경고)
  const dirty = useMemo(() => {
    const p = profile;
    return (
      bio !== (p?.bio ?? "") ||
      career !== (p?.career ?? "") ||
      majorName !== (p?.majorName ?? "") ||
      normMain(mainRegion) !== normMain(p?.mainRegion) ||
      normServices(serviceRegions) !== normServices(p?.serviceRegions) ||
      !sameIds(instrumentIds, (p?.instruments ?? []).map((i) => i.instId))
    );
  }, [profile, bio, career, majorName, mainRegion, serviceRegions, instrumentIds]);

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  if (isLoading) return <div css={s.state}>신청서를 불러오는 중...</div>;
  if (isError) {
    return (
      <div css={s.state} role="alert">
        <strong>신청서를 불러오지 못했어요</strong>
        잠시 후 다시 시도해주세요.
      </div>
    );
  }

  const rawStatus = profile?.status ?? principal?.artistStatus ?? "NONE";
  const status: ArtistStatus = (["NONE", "PENDING", "APPROVED", "REJECTED"] as const).includes(rawStatus as ArtistStatus)
    ? (rawStatus as ArtistStatus)
    : "NONE";
  const locked = status !== "NONE" && status !== "REJECTED";
  const nonMajor = majorName.trim() === NON_MAJOR;

  const payload = { bio, career, majorName, instrumentIds, mainRegion, serviceRegions };

  // 필수 항목 (서버 제출 검증과 같음)
  const required = [
    { key: "bio", label: "소개", ok: bio.trim().length > 0 },
    { key: "major", label: "전공", ok: majorName.trim().length > 0 },
    { key: "career", label: "경력", ok: career.trim().length > 0 },
    { key: "service", label: "서비스 가능 지역", ok: serviceRegions.length > 0 },
    { key: "instruments", label: "레슨 악기", ok: instrumentIds.length > 0 },
  ] as const;
  const doneCount = required.filter((r) => r.ok).length;

  const clearError = (k: keyof Errors) => setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));

  const validate = (): Errors => {
    const e: Errors = {};
    if (!bio.trim()) e.bio = "소개를 입력해주세요.";
    else if (bio.length > BIO_MAX) e.bio = `소개는 ${BIO_MAX}자 이하로 입력해주세요.`;
    if (!majorName.trim()) e.major = "전공을 입력해주세요. 음악 비전공이라면 '음악 비전공이에요'를 눌러주세요.";
    if (!career.trim()) e.career = "경력을 입력해주세요. 비전공이어도 활동·가르친 경험을 자세히 적어주시면 돼요.";
    else if (career.length > CAREER_MAX) e.career = `경력은 ${CAREER_MAX}자 이하로 입력해주세요.`;
    if (serviceRegions.length === 0) e.service = "서비스 가능 지역을 1개 이상 추가해주세요.";
    if (instrumentIds.length === 0) e.instruments = "가르칠 악기를 1개 이상 골라주세요.";
    return e;
  };

  const onSave = () =>
    draftMut.mutate(payload, {
      onSuccess: () => toast.success("임시 저장했어요. 나중에 이어서 작성할 수 있어요."),
    });

  const onClickSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("빠진 항목을 채워주세요.");
      requestAnimationFrame(() =>
        document.querySelector('[role="alert"]')?.scrollIntoView({ behavior: "smooth", block: "center" }),
      );
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    submitMut.mutate(payload, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["myArtistProfile"] });
        usePrincipalState.getState().refreshPrincipal();
        setConfirmOpen(false);
        toast.success("신청서를 제출했어요. 심사 결과는 알림으로 알려드려요.");
        navigate("/mypage/artist/pending", { replace: true });
      },
      onError: () => setConfirmOpen(false), // 실패 메시지는 전역 토스트
    });
  };

  return (
    <div css={s.page}>
      <div css={s.header}>
        <h1 css={s.title}>아티스트 신청</h1>
        <p css={s.desc}>
          신청서를 작성해 제출하면 심사 후 아티스트로 활동할 수 있어요. 승인되면 레슨을 만들고 수강생의 예약을 받을 수 있어요.
        </p>
        <ol css={s.steps} aria-label="신청 순서">
          <li>
            <b>1</b>신청서 작성 (임시 저장 가능)
          </li>
          <li>
            <b>2</b>제출
          </li>
          <li>
            <b>3</b>심사 후 승인 알림
          </li>
        </ol>
      </div>

      {status === "REJECTED" && (
        <div css={s.notice("error")} role="status">
          <strong>신청이 반려됐어요</strong>
          {profile?.rejectReasonTitle && <span css={s.rejectTitle}>반려 사유 · {profile.rejectReasonTitle}</span>}
          {profile?.rejectedReason && <span css={s.rejectReason}>{profile.rejectedReason}</span>}
          <span>아래 신청서를 고쳐 다시 제출하면 다시 심사해요. 전공·경력·악기 모두 수정할 수 있어요.</span>
        </div>
      )}
      {status === "PENDING" && (
        <div css={s.notice("warn")} role="status">
          <strong>심사 중이에요</strong>
          심사가 끝날 때까지 신청서를 수정할 수 없어요.
        </div>
      )}
      {status === "APPROVED" && (
        <div css={s.notice("info")} role="status">
          <strong>이미 승인된 아티스트예요</strong>
          프로필은 인증 및 개인정보 &gt; 아티스트 프로필에서 수정할 수 있어요.
        </div>
      )}

      <div css={s.stack}>
        {/* 기본 정보 */}
        <section css={fs.card}>
          <div css={fs.cardHeader}>
            <div>
              <h2 css={fs.cardTitle}>기본 정보</h2>
              <p css={fs.cardDesc}>공개 프로필에 그대로 보여요.</p>
            </div>
          </div>
          <div css={fs.fields}>
            <div css={fs.field}>
              <div css={fs.labelRow}>
                <label css={fs.label} htmlFor="apply-bio">
                  소개<span css={fs.required}>*</span>
                </label>
                <span css={fs.counter}>
                  {bio.length}/{BIO_MAX}
                </span>
              </div>
              <textarea
                id="apply-bio"
                css={fs.textarea(!!errors.bio)}
                rows={3}
                maxLength={BIO_MAX}
                disabled={locked}
                value={bio}
                placeholder="예: 처음 악기를 잡는 분도 부담 없이 시작할 수 있게, 기초 자세부터 차근차근 알려드려요."
                onChange={(e) => {
                  setField("bio", e.target.value);
                  clearError("bio");
                }}
              />
              {errors.bio ? (
                <p css={fs.error} role="alert">
                  {errors.bio}
                </p>
              ) : (
                <p css={fs.helper}>수강생이 가장 먼저 보는 한두 줄 소개예요.</p>
              )}
            </div>

            <div css={fs.field}>
              <div css={fs.labelRow}>
                <label css={fs.label} htmlFor="apply-major">
                  전공<span css={fs.required}>*</span>
                </label>
              </div>
              <div css={s.majorRow}>
                <input
                  id="apply-major"
                  css={fs.input(!!errors.major)}
                  maxLength={MAJOR_MAX}
                  disabled={locked || nonMajor}
                  value={majorName}
                  placeholder="예: 피아노, 실용음악(보컬), 작곡"
                  onChange={(e) => {
                    setField("majorName", e.target.value);
                    clearError("major");
                  }}
                />
                <button
                  type="button"
                  css={s.toggleChip(nonMajor)}
                  aria-pressed={nonMajor}
                  disabled={locked}
                  onClick={() => {
                    setField("majorName", nonMajor ? "" : NON_MAJOR);
                    clearError("major");
                  }}
                >
                  {nonMajor ? "✓ " : ""}음악 비전공이에요
                </button>
              </div>
              {errors.major ? (
                <p css={fs.error} role="alert">
                  {errors.major}
                </p>
              ) : (
                <p css={fs.helper}>
                  음악 전공이 아니어도 신청할 수 있어요. 대신 아래 경력을 자세히 적어주세요. 승인 후에는 바꿀 수 없어요.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 경력 */}
        <section css={fs.card}>
          <div css={fs.cardHeader}>
            <div>
              <h2 css={fs.cardTitle}>
                경력<span css={fs.required}>*</span>
              </h2>
              <p css={fs.cardDesc}>
                전공 여부와 관계없이 경력을 함께 보고 심사해요. <b>구체적으로 적을수록 심사가 빠르고 정확해요.</b>
              </p>
            </div>
          </div>
          <div css={fs.fields}>
            <ul css={s.guide}>
              <li>악기를 다룬 기간과 배운 방법 (전공·학원·독학 등)</li>
              <li>공연·밴드·반주·대회 등 활동 경험</li>
              <li>가르쳐 본 경험 (대상, 기간, 횟수)</li>
              <li>자격증·수상·수료 이력이 있다면 함께</li>
            </ul>
            <div css={fs.field}>
              <div css={fs.labelRow}>
                <label css={fs.label} htmlFor="apply-career">
                  경력 내용
                </label>
                <span css={fs.counter}>
                  {career.length}/{CAREER_MAX}
                </span>
              </div>
              <textarea
                id="apply-career"
                css={fs.textarea(!!errors.career)}
                rows={8}
                maxLength={CAREER_MAX}
                disabled={locked}
                value={career}
                placeholder={CAREER_EXAMPLE}
                onChange={(e) => {
                  setField("career", e.target.value);
                  clearError("career");
                }}
              />
              {errors.career && (
                <p css={fs.error} role="alert">
                  {errors.career}
                </p>
              )}
              <button
                type="button"
                css={s.textBtn}
                disabled={locked || career.trim().length > 0}
                title={career.trim() ? "내용이 비어 있을 때만 넣을 수 있어요" : undefined}
                onClick={() => setField("career", CAREER_EXAMPLE)}
              >
                작성 예시 넣고 고쳐 쓰기
              </button>
            </div>
          </div>
        </section>

        {/* 활동 지역 */}
        <section css={fs.card}>
          <div css={fs.cardHeader}>
            <div>
              <h2 css={fs.cardTitle}>활동 지역</h2>
              <p css={fs.cardDesc}>수강생이 지역으로 레슨을 찾을 때 쓰여요. 서비스 가능 지역은 1개 이상 필요해요.</p>
            </div>
          </div>
          <MainRegionField disabled={locked} />
          <ServiceRegionField disabled={locked} onEdit={() => clearError("service")} />
          {errors.service && (
            <p css={fs.error} role="alert" style={{ marginTop: 12 }}>
              {errors.service}
            </p>
          )}
        </section>

        {/* 레슨 악기 */}
        <section css={fs.card}>
          <div css={fs.cardHeader}>
            <div>
              <h2 css={fs.cardTitle}>
                레슨 악기<span css={fs.required}>*</span>
              </h2>
              <p css={fs.cardDesc}>가르칠 수 있는 악기를 골라주세요. 레슨을 만들 때 이 중에서 고르게 돼요.</p>
            </div>
          </div>
          <div style={{ display: "grid", gap: 12 }} onClickCapture={() => clearError("instruments")}>
            <ApplyInstrumentPicker disabled={locked} />
            <SelectedInstrumentChips disabled={locked} />
            {errors.instruments && (
              <p css={fs.error} role="alert">
                {errors.instruments}
              </p>
            )}
          </div>
        </section>
      </div>

      {!locked && (
        <div css={s.actionBar}>
          <span css={s.progress}>
            필수 항목 <b>{doneCount}/{required.length}</b>
            {doneCount < required.length && ` · 남은 항목: ${required.filter((r) => !r.ok).map((r) => r.label).join(", ")}`}
          </span>
          <button type="button" css={s.btn("ghost")} disabled={!dirty || draftMut.isPending || submitMut.isPending} onClick={onSave}>
            {draftMut.isPending ? "저장 중..." : "임시 저장"}
          </button>
          <button type="button" css={s.btn("primary")} disabled={draftMut.isPending || submitMut.isPending} onClick={onClickSubmit}>
            {status === "REJECTED" ? "다시 제출하기" : "제출하기"}
          </button>
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        title="신청서를 제출할까요?"
        message="제출하면 심사가 끝날 때까지 신청서를 수정할 수 없어요. 결과는 알림으로 알려드려요."
        confirmText="제출하기"
        cancelText="더 살펴볼게요"
        loading={submitMut.isPending}
        onConfirm={handleConfirmSubmit}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}

export default ArtistApplyPage;
