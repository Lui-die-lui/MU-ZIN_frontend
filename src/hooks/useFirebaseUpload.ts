import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { auth, storage } from "../configs/firebaseConfig";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  type UploadTask,
} from "firebase/storage";
import { signInAnonymously } from "firebase/auth";

let authReadyPromise: Promise<void> | null = null;

async function ensureFirebaseAuth() {
  if (auth.currentUser) return;
  if (!authReadyPromise) {
    authReadyPromise = signInAnonymously(auth).then(() => undefined);
  }
}

// Storage에 실제 저장되는 이름은 여기서(hooks에서) 결정
// 크롭 util은 순수 기능(image -> file) 만 담당

export const useFirebaseUpload = () => {
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // 파일 객체와 폴더 이름을 받아서 업로드 후 URL을 반환
  const uploadFile = async (file: File, folder: string): Promise<string> => {
    // 업로드 전 보장
    await ensureFirebaseAuth();

    //Promise로 감싸서 업로드 끝날 때 (승인 -> url, 반려 -> 에러)
    return new Promise(async (resolve, reject) => {
      try {
        if (!file || !folder) {
          throw new Error("파일이나 폴더가 지정되지 않았습니다.");
        }

        if (!file.type.startsWith("image/")) {
          throw new Error("이미지 파일만 업로드할 수 있습니다.");
        }

        // rule 방어 추가  5mb 제한
        const MAX = 5 * 1024 * 1024;
        if (file.size >= MAX) throw new Error("파일이 5MB를 초과했습니다.");

        await ensureFirebaseAuth();

        // 업로드가 시작됐음을 표시
        setIsUploading(true);
        // 이전 업로드 진행률 및 에러값, url 초기화
        setProgress(0);

        // uuid로 중복 방지용 문자열 생성
        // 파일 확장자 추출(.뒤로 파일 확장자 명)
        const ext = file.name.split(".").pop() || "jpg"; // 확장자 없을때 대비
        const fileName = `${uuidv4()}.${ext}`;
        const storageRef = ref(storage, `${folder}/${fileName}`);

        // 업로드 시작(진행률 추적)
        const uploadTask = uploadBytesResumable(storageRef, file, {
          // contentType 비어있는 케이스 방어
          contentType: file.type || "image/jpeg",
        });

        // 업로드 중일 때
        uploadTask.on(
          "state_changed",
          (snapShot) => {
            // 진행률 계산
            const currentProgress = Math.round(
              // 현재 업로드 바이트수 / 전체 파일 크기
              (snapShot.bytesTransferred / snapShot.totalBytes) * 100,
            );

            // 갱신
            setProgress(currentProgress);
          },
          // 에러 발생 시 업로드 상태 종료 -> 에러 reject로 반환
          (error) => {
            setIsUploading(false);
            reject(error);
          },

          // 업로드 완료 시 성공 처리
          async () => {
            // firebase storage 내 해당 파일의 실제 접근 url을 가져옴
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            } finally {
              setIsUploading(false);
            }
          },
        );
      } catch (e) {
        setIsUploading(false);
        reject(e);
      }
    });
  };
  return { uploadFile, isUploading, progress };
};
