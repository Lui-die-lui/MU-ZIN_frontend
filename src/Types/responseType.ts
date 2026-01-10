export type ApiStatus = "success" | "failed";

export type ApiRespDto<T> = {
  status: "success" | "failed";
  message: string;
  data: T;
};
