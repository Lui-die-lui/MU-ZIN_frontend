import { useMutation } from "@tanstack/react-query";
import { createReportReq } from "../../apis/report/reportApi";

export const useCreateReport = () => useMutation({ mutationFn: createReportReq });
