export type ApiRespDto<T> = {
  status: "success" | "failed";
  message: string;
  data: T;
};
