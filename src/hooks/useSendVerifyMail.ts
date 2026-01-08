import { useMutation } from "@tanstack/react-query";
import { sendEmailCodeReq } from "../apis/auth/authApi";

export const useSendVerifyMail = () => {
  return useMutation({
    mutationFn: (email: string) => sendEmailCodeReq(email),
  });
};
