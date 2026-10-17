import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { auth, storage } from "../configs/firebaseConfig";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { signInAnonymously } from "firebase/auth";

let authReadyPromise: Promise<void> | null = null;

// 업로드 전에 Firebase 익명 로그인 보장
// (예전엔 Promise를 만들기만 하고 기다리지 않아서 첫 업로드가 인증 전에 시작될 수 있었음)
async function ensureFirebaseAuth() {
  if (auth.currentUser) return;
  if (!authReadyPromise) {
    authReadyPromise = signInAnonymously(auth)
      .then(() => undefined)
      .catch((e) => {
        authReadyPromise = null; // 실패하면 다음 업로드 때 다시 시도
        throw e;
      });
  }
  await authReadyPromise;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB (Storage rule과 동일)

// Storage에 실제 저장되는 이름은 여기서(hooks에서) 결정
// 크롭 util은 순수 기능(image -> file) 만 담당

export const useFirebaseUpload = () => {
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // 파일 객체와 폴더 이름을 받아서 업로드 후 URL을 반환
  const uploadFile = async (file: File, folder: string): Promise<string> => {
    // 입력 검증 (실패하면 바로 reject)
    if (!file || !folder) {
      throw new Error("파일이나 폴더가 지정되지 않았습니다.");
    }
    if (!file.type.startsWith("image/")) {
      throw new Error("이미지 파일만 업로드할 수 있습니다.");
    }
    if (file.size >= MAX_SIZE) {
      throw new Error("파일이 5MB를 초과했습니다.");
    }

    await ensureFirebaseAuth();

    // 업로드가 시작됐음을 표시 + 이전 진행률 초기화
    setIsUploading(true);
    setProgress(0);

    // uuid로 중복 방지용 파일명 생성 (확장자 없을 때 대비)
    const ext = file.name.split(".").pop() || "jpg";
    const storageRef = ref(storage, `${folder}/${uuidv4()}.${ext}`);

    // 업로드 시작(진행률 추적)
    const uploadTask = uploadBytesResumable(storageRef, file, {
      // contentType 비어있는 케이스 방어
      contentType: file.type || "image/jpeg",
    });

    //Promise로 감싸서 업로드 끝날 때 (승인 -> url, 반려 -> 에러)
    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapShot) => {
          // 진행률 = 현재 업로드 바이트수 / 전체 파일 크기
          setProgress(Math.round((snapShot.bytesTransferred / snapShot.totalBytes) * 100));
        },
        // 업로드 실패
        (error) => {
          setIsUploading(false);
          reject(error);
        },
        // 업로드 완료 -> 실제 접근 url 조회 (실패해도 반드시 reject 해서 호출부가 멈추지 않게)
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(resolve)
            .catch(reject)
            .finally(() => setIsUploading(false));
        },
      );
    });
  };
  return { uploadFile, isUploading, progress };
};
