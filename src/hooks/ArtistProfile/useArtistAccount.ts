import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyArtistProfileReq,
  updateApprovedProfileReq,
} from "../../apis/artist/artistApi";
import { useArtistApplyFormStore } from "../../stores/useArtistApplyFormStore";
import { useEffect, useMemo } from "react";
import type { ArtistProfileUpsertRequest } from "../../Types/artistApplyTypes";

function useArtistAccount() {
  const qc = useQueryClient();

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["artistProfile", "me"],
    queryFn: async () => {
      const resp = await getMyArtistProfileReq();
      return resp.data.data;
    },
  });

  const bio = useArtistApplyFormStore((s) => s.bio);
  const career = useArtistApplyFormStore((s) => s.career);
  const majorName = useArtistApplyFormStore((s) => s.majorName);
  const mainRegion = useArtistApplyFormStore((s) => s.mainRegion);
  const serviceRegions = useArtistApplyFormStore((s) => s.serviceRegions);

  const hydrateFormProfile = useArtistApplyFormStore(
    (s) => s.hydrateFormProfile,
  );
  const reset = useArtistApplyFormStore((s) => s.reset);

  useEffect(() => {
    if (!profile) return;
    hydrateFormProfile(profile);
  }, [profile, hydrateFormProfile]);

  // 리셋 할 필요가 있나?
  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  const isDirty = useMemo(() => {
    if (!profile) return;

    const currentMainRegion = JSON.stringify(mainRegion ?? null);
    const originalMainRegion = JSON.stringify(
      profile.mainRegion
        ? {
            region1DepthName: profile.mainRegion.region1DepthName ?? null,
            region2DepthName: profile.mainRegion.region2DepthName ?? null,
            region3DepthName: profile.mainRegion.region3DepthName ?? null,
            addressLabel: profile.mainRegion.addressLabel ?? null,
            roadAddress: null,
            jibunAddress: null,
            latitude: profile.mainRegion.latitude ?? null,
            longitude: profile.mainRegion.longitude ?? null,
          }
        : null,
    );

    const currentServiceRegions = JSON.stringify(
      [...serviceRegions]
        .map((region) => ({
          region1DepthName: region.region1DepthName,
          region2DepthName: region.region2DepthName,
        }))
        .sort((a, b) =>
          `${a.region1DepthName}-${a.region2DepthName}`.localeCompare(
            `${b.region1DepthName}-${b.region2DepthName}`,
          ),
        ),
    );

    const originalServiceRegions = JSON.stringify(
      [...(profile.serviceRegions ?? [])]
        .map((region) => ({
          region1DepthName: region.region1DepthName,
          region2DepthName: region.region2DepthName,
        }))
        .sort((a, b) =>
          `${a.region1DepthName}-${a.region2DepthName}`.localeCompare(
            `${b.region1DepthName}-${b.region2DepthName}`,
          ),
        ),
    );

    return (
      (bio ?? "") !== (profile.bio ?? "") ||
      (career ?? "") !== (profile.career ?? "") ||
      (majorName ?? "") !== (profile.majorName ?? "") ||
      currentMainRegion !== originalMainRegion ||
      currentServiceRegions !== originalServiceRegions
    );
  }, [profile, bio, career, majorName, mainRegion, serviceRegions]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error("아티스트 프로필이 없습니다.");

      const body: ArtistProfileUpsertRequest = {
        bio,
        career,
        majorName,
        mainRegion,
        serviceRegions,
      };

      const res = await updateApprovedProfileReq(body);
      return res.data.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["artistProfile", "me"] });
      await qc.invalidateQueries({
        queryKey: ["artistProfileDetail", profile?.artistProfileId],
      });
      await qc.invalidateQueries({ queryKey: ["principal"] });
      alert("저장이 완료되었습니다.");
    },
    onError: () => {
      alert("저장 실패");
    },
  });

  return {
    profile,
    isLoading,
    isError,
    isDirty,
    save: () => saveMutation.mutate(),
    isSaving: saveMutation.isPending,
  };
}

export default useArtistAccount;
