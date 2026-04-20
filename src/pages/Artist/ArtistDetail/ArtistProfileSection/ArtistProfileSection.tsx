/** @jsxImportSource @emotion/react */
import { FaMapMarkerAlt } from "react-icons/fa";
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
            src={artist.profileImgUrl ?? "/default-profile.png"}
            alt={artist.username}
          />
        </div>

        <div css={s.infoWrap}>
          <div css={s.headerRow}>
            <div css={s.identityBlock}>
              <div css={s.nameAndMajorGroup}>
                <h2 css={s.username}>{artist.username}</h2>
                <p css={s.major}>{artist.majorName}</p>
              </div>

              <div css={s.mainRegion}>
                <FaMapMarkerAlt css={s.locationIcon} />
                {artist.mainRegion?.addressLabel?.length ? (
                  <span>
                    {[
                      artist.mainRegion.addressLabel,
                      artist.mainRegion.detailAddress,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </span>
                ) : (
                  <span css={s.emptyText}>
                    스튜디오/주 활동 지역이 없습니다.
                  </span>
                )}
              </div>
            </div>

            {isOwner && (
              <button css={s.editButton} onClick={handleClickEdit}>
                <MdEdit size={15} />
              </button>
            )}
          </div>

          <div css={s.metaList}>
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

            <div css={s.metaSection}>
              <p css={s.metaLabel}>레슨 지역</p>
              <div css={s.tagRow}>
                {artist.serviceRegions.length > 0 ? (
                  artist.serviceRegions.map((region, index) => (
                    <span
                      key={`${region.region1DepthName}-${region.region2DepthName}-${region.region3DepthName}-${index}`}
                      css={s.serviceRegionChip}
                    >
                      {[
                        region.region1DepthName,
                        region.region2DepthName,
                        region.region3DepthName,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    </span>
                  ))
                ) : (
                  <span css={s.emptyText}>등록된 서비스 지역 없음</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArtistProfileSection;
