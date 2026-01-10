import { list } from "./../pages/MyPage/Home/NotificationSummary/styles";
import type { InstrumentResponse } from "./../Types/instrumentTypes";
import { create } from "zustand";
import type {
  ApplyArtistPayload,
  ArtistProfileResponse,
} from "../Types/artistApplyTypes";

type State = ApplyArtistPayload & {
  selectedInstruments: InstrumentResponse[]; // 선택한 악기 담아줄 배열
  hydrated: boolean; // 초기값 세팅 여부

  // 폼 필드가 여러개 bio, career, majorName, instrumentIds
  // 필드마다 setter를 여러개 만들 수 있지만, 그럼 코드가 늘어남.
  // K = 제네릭
  // setBio: (v: string) => void
  // setCareer: (v: string) => void
  // setMajorName: (v: string) => void
  // setInstrumentIds: (v: number[]) => void 이런걸 줄여줌
  setField: <K extends keyof ApplyArtistPayload>(
    key: K,
    value: ApplyArtistPayload[K] // 해당 키에 맞는 타입만 들어갈 수 있어서 안전
  ) => void;

  setSelectedInstruments: (list: InstrumentResponse[]) => void; // 선택한 악기 담은 배열
  removeInstrument: (instId: number) => void; // 악기 id를 클릭할 때 있으면 제거/없으면 추가
  hydrateFormProfile: (p: ArtistProfileResponse) => void; // 서버에서 받아온 프로필 응답을 store 폼 상태로 주입하는 함수(초기 채우기)
  reset: () => void; // 폼 초기화
};

// 기본 폼 값 정의
const initial: ApplyArtistPayload = {
  bio: "",
  career: "",
  majorName: "",
  instrumentIds: [],
};

export const userArtistApplyFormStore = create<State>((set, get) => ({
  ...initial, // 초기 폼 값을 넣고
  selectedInstruments: [],
  hydrated: false, // 서버 값으로 채운 적 없으니 false

  setField: (key, value) =>
    // key에 해당하는 필드만 업데이트
    set({ [key]: value } as Pick<ApplyArtistPayload, typeof key>),
  // Pick = TS가 동적 키를 잘 못 추론해서 붙인 캐스팅
  // 없으면 키값중 어떤 필드인지 확신 못 해서 오류날 수 있음

  setSelectedInstruments: (list) =>
    set({
      selectedInstruments: list,
      instrumentIds: list.map((i) => i.instId), // ids 싱크 맞춰줌
    }),

  removeInstrument: (instId) => {
    const next = get().selectedInstruments.filter((i) => i.instId !== instId);
    set({
      selectedInstruments: next,
      instrumentIds: next.map((i) => i.instId),
    });
  },

  hydrateFormProfile: (p) => {
    // 이미 한번 hydrate 했다면, 사용자가 작성중인 걸 덮어쓰지 않기 위해 막음
    if (get().hydrated) return;

    set({
      bio: p.bio ?? "",
      career: p.career ?? "",
      majorName: p.majorName ?? "",
      selectedInstruments: p.instruments ?? [], // 객체로 저장
      instrumentIds: (p.instruments ?? []).map((i) => i.instId), // ids도 저장
      // 검색창에 딸려있는 악기 컴포넌트 재 사용하려는데 
      // 상위 카테고리를 바꾸면 선택한 악기들이 다 지워짐
      // 검색창에서는 한가지 악기만 선택 가능하게 해놨기 때문...
      // 그래서 ui로 보여줄 고른 악기도 저장해주고, 서버에 보낼 악기도 저장해주는중 
      hydrated: true, // 초기 채움 끝으로 표시
    });
    // 서버 프로필을 폼 초기값으로 딱 1번만 채우는 함수 - db를 계속 조회하는걸 막음
  },

  reset: () => set({ ...initial, hydrated: false }),
  // 폼을 비우고 hydrated도 초기화
  // 다음에 다시 페이지 들어오면 서버값 채우기 가능해짐
}));
