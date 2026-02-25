import type { ReservationKeyParams } from "../../Types/reservationType";

export const reservationKeys = {
  all: ["reservations"] as const,

  artist: () => [...reservationKeys.all, "artist"] as const,
  me: () => [reservationKeys.all, "me"] as const,

  // { status: status ?? null } 빈 값 때문에 캐시 키가 흔들리는거 방지됨
  artistList: (p: ReservationKeyParams) =>
    [
      ...reservationKeys.artist(),
      "list",
      { tab: p.tab, status: p.status ?? null },
    ] as const,

  myList: (p: ReservationKeyParams) =>
    [
      ...reservationKeys.me(),
      "list",
      { tab: p.tab, status: p.status ?? null },
    ] as const,

  artistDetail: (reservationId: number) =>
    [
      ...reservationKeys.artist(), "detail"
      // "artistReservationDetail"
      , reservationId] as const,
};
