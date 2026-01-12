/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useEffect, useState } from "react";
import { useMyArtistProfile } from "../../../../hooks/ArtistProfile/useMyArtistProfile";
import { userArtistApplyFormStore } from "../../../../stores/useArtistApplyFormStore";
import { useArtistDraftSaveMutation } from "../../../../hooks/ArtistProfile/useArtistdraftSaveMutation";
import { useArtistSubmitMutation } from "../../../../hooks/ArtistProfile/useArtistSubmitMutation";
import ApplyStatusBanner from "./ArtistStatusBanner";
import ArtistProfileFields from "./ArtistProfileFields";
import ApplyInstrumentPicker from "./ApplyInstrumentPicker";
import SelectedInstrumentChips from "./SelectedInstrumentChips";
import ApplyActions from "./ApplyActions";
import { usePrincipalState } from "../../../../stores/usePrincipalState";
import type { ArtistStatus } from "../../../../Types/auth";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmModal from "../../../../components/common/ConfirmModal/ConfirmModal";

function ArtistApplyPage() {
  const { data: profile, isLoading, isError } = useMyArtistProfile();
  const { principal } = usePrincipalState();

  const { bio, career, majorName, instrumentIds, hydrateFormProfile } =
    userArtistApplyFormStore();

  // 제출 시 화면 즉시 반영 및 알림 창
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    if (profile) hydrateFormProfile(profile); // 이전 작성목록 있으면 채워줌
    // 없으면 그냥 초기값
  }, [profile, hydrateFormProfile]);

  const draftMut = useArtistDraftSaveMutation(); // 임시저장 반영
  const submitMut = useArtistSubmitMutation();

  if (isLoading) return <div css={s.state}>로딩중...</div>;
  if (isError) return <div css={s.state}>조회 실패</div>;

  // profile이 null이면 아직 작성 안함 -> status = principal에서 fallback
  const rawStatus = profile?.artistStatus ?? principal?.artistStatus ?? "NONE";

  // 삼항 연산 + 타입 좁히기
  const status: ArtistStatus =
    rawStatus === "NONE" ||
    rawStatus === "PENDING" ||
    rawStatus === "APPROVED" ||
    rawStatus === "REJECTED"
      ? rawStatus
      : "NONE"; // 혹시 모를 예외값 방어

  // 수정 가능한 상태 정의(ReadonlySet = 읽기 전용 set 타입)
  const editableStatuses: ReadonlySet<ArtistStatus> = new Set([
    "NONE",
    "REJECTED",
  ]);

  // 해당 상태를 가지고 있느냐만 검증
  const isEditable = editableStatuses.has(status);

  // NONE 상태만 접근 허용
  const locked = !isEditable;
  // 담을 객체
  const payload = { bio, career, majorName, instrumentIds };

  const handleConfirmSubmit = () => {
    submitMut.mutate(payload, {
      onSuccess: () => {
        // 상태 동기화
        qc.invalidateQueries({ queryKey: ["myArtistProfile"] });
        qc.invalidateQueries({ queryKey: ["principal"] });

        setConfirmOpen(false);
        navigate("/mypage/artist/pending", { replace: true });
      },
      onError: () => {
        // 실패 시 모달 닫기
        setConfirmOpen(false);
      },
    });
  };

  // 간단한 제출 검증
  const canSubmit =
    !locked &&
    bio.trim().length > 0 &&
    career.trim().length > 0 &&
    majorName.trim().length > 0 &&
    instrumentIds.length > 0;

  return (
    <div css={s.page}>
      <ApplyStatusBanner status={status} />

      <section css={s.card}>
        <h2 css={s.h2}>기본 정보</h2>
        <ArtistProfileFields disabled={locked} />
      </section>

      <section css={s.card}>
        <h2 css={s.h2}>레슨 악기</h2>
        <ApplyInstrumentPicker disabled={locked} />
        <SelectedInstrumentChips disabled={locked} />
        <p css={s.hint}>* 최소 1개 이상 선택해야 제출할 수 있어요.</p>
      </section>

      <ApplyActions
        disabledAll={locked}
        canSubmit={canSubmit}
        saving={draftMut.isPending}
        submitting={submitMut.isPending}
        onSave={() => draftMut.mutate(payload)}
        onSubmit={() => setConfirmOpen(true)}
      />

      <ConfirmModal
        open={confirmOpen}
        title="제출 확인"
        message="신청서를 제출하시겠습니까?"
        loading={submitMut.isPending}
        onConfirm={handleConfirmSubmit}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}

export default ArtistApplyPage;
