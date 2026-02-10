import type { ReservationStatus } from "../../Types/reservationType";

export const reservationKeys = {
  all: ["reservations"] as const,

  artist: () => [...reservationKeys.all, "artist"] as const,

  // { status: status ?? null } 빈 값 때문에 캐시 키가 흔들리는거 방지됨
  artistList: (status?: ReservationStatus) =>
    [...reservationKeys.artist(), "list", { status: status ?? null }] as const,

  artistDetail: (reservationId: number) =>
    [...reservationKeys.artist(), "detail", reservationId] as const,
};
