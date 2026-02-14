import type {
  ArtistReservationKeyParams,
  ReservationStatus,
} from "../../Types/reservationType";

export const reservationKeys = {
  all: ["reservations"] as const,

  artist: () => [...reservationKeys.all, "artist"] as const,

  // { status: status ?? null } 빈 값 때문에 캐시 키가 흔들리는거 방지됨
  artistList: (p: ArtistReservationKeyParams) =>
    [
      ...reservationKeys.artist(),
      "list",
      {
        tab: p.tab,
        status: p.status ?? null,
        from: p.from ?? null,
        to: p.to ?? null,
      },
    ] as const,

  artistDetail: (reservationId: number) =>
    [...reservationKeys.artist(), "detail", reservationId] as const,
};
