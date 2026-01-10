type Props = {
  disabledAll: boolean;
  canSubmit: boolean;
  saving: boolean;
  submitting: boolean;
  onSave: () => void;
  onSubmit: () => void;
};


function ApplyActions({
  disabledAll,
  canSubmit,
  saving,
  submitting,
  onSave,
  onSubmit,
}: Props) {
  const busy = saving || submitting;
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button type="button" disabled={disabledAll || busy} onClick={onSave}>
        {saving ? "저장중..." : "임시 저장"}
      </button>

      <button type="button" disabled={!canSubmit || busy} onClick={onSubmit}>
        {submitting ? "제출중..." : "제출"}
      </button>
    </div>
  );
}

export default ApplyActions;
