import { userArtistApplyFormStore } from "../../../../stores/useArtistApplyFormStore";

// 기본 입력 필드들
type Props = { disabled: boolean };

export default function ArtistProfileFields({ disabled }: Props) {
  const { bio, career, majorName, setField } = userArtistApplyFormStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <label>
        소개
        <input
          value={bio}
          disabled={disabled}
          onChange={(e) => setField("bio", e.target.value)}
        />
      </label>

      <label>
        경력
        <textarea
          value={career}
          disabled={disabled}
          onChange={(e) => setField("career", e.target.value)}
        />
      </label>

      <label>
        전공
        <input
          value={majorName}
          disabled={disabled}
          onChange={(e) => setField("majorName", e.target.value)}
        />
      </label>
    </div>
  );
}