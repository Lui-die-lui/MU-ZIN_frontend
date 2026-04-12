import { useMemo, useState } from "react";
import type { ArtistServiceRegion, RegionOption } from "../../Types/artistRegionTypes";
import type { Option } from "../../Types/commonTypes";
import { useQuery } from "@tanstack/react-query";
import {
  getChildRegionsReq,
  getSidoListReq,
} from "../../apis/region/regionApi";
import { regionKeys } from "./regionKeys";

// UI 공통 타입 기반
const toOptions = (regions: RegionOption[]): Option<number>[] =>
  regions.map((region) => ({
    value: region.regionId,
    label: region.name,
    subLabel: region.fullName,
  }));

const resolveExactMatch = (
  input: string,
  selected: RegionOption | null,
  options: RegionOption[],
) => {
  const value = input.trim();

  if (!value) {
    return { matched: null, invalid: false };
  }

  if (selected && selected.name === value) {
    return { matched: selected, invalid: false };
  }

  const exact = options.find((option) => option.name === value);

  if (exact) {
    return { matched: exact, invalid: false };
  }

  return { matched: null, invalid: true };
};

export function useRegionSelector() {
  const [sidoInput, setSidoInput] = useState("");
  const [sigunguInput, setSigunguInput] = useState("");
  const [emdInput, setEmdInput] = useState("");

  const [selectedSido, setSelectedSido] = useState<RegionOption | null>(null);
  const [selectedSigungu, setSelectedSigungu] = useState<RegionOption | null>(
    null,
  );
  const [selectedEmd, setSelectedEmd] = useState<RegionOption | null>(null);

  const [sidoError, setSidoError] = useState("");
  const [sigunguError, setSigunguError] = useState("");
  const [emdError, setEmdError] = useState("");

  const { data: sidoRaw = [], isLoading: isSidoLoading } = useQuery({
    queryKey: regionKeys.sidoList(sidoInput),
    queryFn: () => getSidoListReq(sidoInput),
  });

  const { data: sigunguRaw = [], isLoading: isSigunguLoading } = useQuery({
    queryKey: regionKeys.childrenList(
      selectedSido?.regionId ?? null,
      sigunguInput,
    ),
    queryFn: () => getChildRegionsReq(selectedSido!.regionId, sigunguInput),
    enabled: !!selectedSido,
  });

  const { data: emdRaw = [], isLoading: isEmdLoading } = useQuery({
    queryKey: regionKeys.childrenList(
      selectedSigungu?.regionId ?? null,
      emdInput,
    ),
    queryFn: () => getChildRegionsReq(selectedSigungu!.regionId, emdInput),
    enabled: !!selectedSigungu,
  });

  const sidoOptions = useMemo(() => toOptions(sidoRaw), [sidoRaw]);
  const sigunguOptions = useMemo(() => toOptions(sigunguRaw), [sigunguRaw]);
  const emdOptions = useMemo(() => toOptions(emdRaw), [emdRaw]);

  const handleChangeSido = (value: string) => {
    setSidoInput(value);
    setSelectedSido(null);
    setSidoError("");

    setSigunguInput("");
    setSelectedSigungu(null);
    setSigunguError("");

    setEmdInput("");
    setSelectedEmd(null);
    setEmdError("");
  };

  const handleChangeSigungu = (value: string) => {
    setSigunguInput(value);
    setSelectedSigungu(null);
    setSigunguError("");

    setEmdInput("");
    setSelectedEmd(null);
    setEmdError("");
  };

  const handleChangeEmd = (value: string) => {
    setEmdInput(value);
    setSelectedEmd(null);
    setEmdError("");
  };

  const handleSelectSido = (option: Option<number>) => {
    const found = sidoRaw.find((item) => item.regionId === option.value);
    if (!found) return;

    setSelectedSido(found);
    setSidoInput(found.name);
    setSidoError("");

    setSigunguInput("");
    setSelectedSigungu(null);
    setSigunguError("");

    setEmdInput("");
    setSelectedEmd(null);
    setEmdError("");
  };

  const handleSelectSigungu = (option: Option<number>) => {
    const found = sigunguRaw.find((item) => item.regionId === option.value);
    if (!found) return;

    setSelectedSigungu(found);
    setSigunguInput(found.name);
    setSigunguError("");

    setEmdInput("");
    setSelectedEmd(null);
    setEmdError("");
  };

  const handleSelectEmd = (option: Option<number>) => {
    const found = emdRaw.find((item) => item.regionId === option.value);
    if (!found) return;

    setSelectedEmd(found);
    setEmdInput(found.name);
    setEmdError("");
  };

  const validateSido = () => {
    const result = resolveExactMatch(sidoInput, selectedSido, sidoRaw);

    setSelectedSido(result.matched);
    setSidoError(result.invalid ? "존재하지 않는 지역입니다." : "");

    return result;
  };

  const validateSigungu = () => {
    const result = resolveExactMatch(sigunguInput, selectedSigungu, sigunguRaw);

    setSelectedSigungu(result.matched);
    setSigunguError(result.invalid ? "존재하지 않는 지역입니다." : "");

    return result;
  };

  const validateEmd = () => {
    const result = resolveExactMatch(emdInput, selectedEmd, emdRaw);

    setSelectedEmd(result.matched);
    setEmdError(result.invalid ? "존재하지 않는 지역입니다." : "");

    return result;
  };

  const validateAll = () => {
    const sidoResult = validateSido();
    const sigunguResult = validateSigungu();
    const emdResult = validateEmd();

    if (!sidoResult.matched) return false;

    if (sigunguInput.trim() && !sigunguResult.matched) return false;
    if (emdInput.trim() && !emdResult.matched) return false;

    if (emdInput.trim() && !sigunguResult.matched) {
      setSigunguError("읍/면/동을 입력하려면 시/군/구가 필요합니다.");
      return false;
    }

    return true;
  };

  const buildRegionItem = (): ArtistServiceRegion | null => {
    if (!selectedSido) return null;

    return {
      region1DepthName: selectedSido.name,
      region2DepthName: selectedSigungu?.name ?? null,
      region3DepthName: selectedEmd?.name ?? null,
    };
  };

  const resetInputs = () => {
    setSidoInput("");
    setSigunguInput("");
    setEmdInput("");

    setSelectedSido(null);
    setSelectedSigungu(null);
    setSelectedEmd(null);

    setSidoError("");
    setSigunguError("");
    setEmdError("");
  };

  return {
    sidoInput,
    sigunguInput,
    emdInput,

    selectedSido,
    selectedSigungu,
    selectedEmd,

    sidoOptions,
    sigunguOptions,
    emdOptions,

    isSidoLoading,
    isSigunguLoading,
    isEmdLoading,

    sidoError,
    sigunguError,
    emdError,

    handleChangeSido,
    handleChangeSigungu,
    handleChangeEmd,

    handleSelectSido,
    handleSelectSigungu,
    handleSelectEmd,

    validateSido,
    validateSigungu,
    validateEmd,
    validateAll,

    buildRegionItem,
    resetInputs,
  };
}
