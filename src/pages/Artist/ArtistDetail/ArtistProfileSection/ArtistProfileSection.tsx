/** @jsxImportSource @emotion/react */
import { useNavigate } from "react-router-dom";
import type { ArtistProfileDetailResp } from "../../../../Types/artistDetailTypes";
import * as s from "./styles";
import { usePrincipalState } from "../../../../stores/usePrincipalState";
import { MdEdit } from "react-icons/md";

type Props = {
  artist: ArtistProfileDetailResp;
};

function ArtistProfileSection({ artist }: Props) {
  const navigate = useNavigate();
  const principal = usePrincipalState((state) => state.principal);

  const isOwner = principal?.userId === artist.userId;

  const handleClickEdit = () => {
    navigate("/mypage/account/artist");
  };

  return (
    <section css={s.container}>
      <div css={s.topBox}>
        <div css={s.imageWrap}>
          <img
            css={s.profileImage}
            // 기본 이미지 어떻게 처리할지 생각하기
            src={artist.profileImgUrl ?? "/default-profile.png"}
            alt={artist.username}
          />
        </div>

        <div css={s.infoWrap}>
          <div css={s.titleRow}>
            <div css={s.titleGroup}>
              <div css={s.username}>{artist.username}</div>
              <p css={s.major}>{artist.majorName}</p>
            </div>

            {isOwner && (
              // 나중에 icon 처리
              <button css={s.editButton} onClick={handleClickEdit}>
                <MdEdit size={15} />
              </button>
            )}
          </div>

          <div css={s.metaSection}>
            <p css={s.metaLabel}>악기</p>
            <div css={s.tagRow}>
              {artist.instruments.length > 0 ? (
                artist.instruments.map((inst) => (
                  <span key={inst.instId} css={s.instrumentChip}>
                    {inst.instName}
                  </span>
                ))
              ) : (
                <span css={s.emptyText}>등록된 악기 없음</span>
              )}
            </div>
          </div>

          <div css={s.metaSection}>
            <p css={s.metaLabel}>레슨 스타일</p>
            <div css={s.tagRow}>
              {artist.styleTags.length > 0 ? (
                artist.styleTags.map((tag) => (
                  <span key={tag.lessonStyleTagId} css={s.styleChip}>
                    {tag.styleName}
                  </span>
                ))
              ) : (
                <span css={s.emptyText}>등록된 스타일 태그 없음</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div css={s.metaSection}>
        <p css={s.metaLabel}>레슨 스타일</p>
        <div css={s.tagRow}>
          {artist.styleTags.length > 0 ? (
            artist.styleTags.map((tag) => (
              <span key={tag.lessonStyleTagId} css={s.styleChip}>
                {tag.styleName}
              </span>
            ))
          ) : (
            <span css={s.emptyText}>등록된 스타일 태그 없음</span>
          )}
        </div>
      </div>
    </section>
  );
}

export default ArtistProfileSection;
