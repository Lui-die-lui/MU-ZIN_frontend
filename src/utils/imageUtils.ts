import { v4 as uuidv4 } from "uuid";

type Area = { x: number; y: number; width: number; height: number };

async function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export async function getCroppedFile(params: {
  imageSrc: string;
  crop: Area;
  fileName?: string; // 저장 파일명
  outputSize?: number; // 정사각형으로 리사이즈(픽셀이 들어옴)
  mimeType?: "image/jpeg" | "image/png" | "image/webp"; // 결과 확장자 / 인코딩 포맷
  quality?: number; // jpeg 퀄리티
}): Promise<File> {
  const {
    imageSrc,
    crop,
    outputSize = 512,
    mimeType = "image/jpeg",
    quality = 0.92,
    fileName,
  } = params;

  const ext = mimeType === "image/png" ? "png" : "jpg";
  const safeFileName = fileName ?? `avatar.${ext}`;

  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context를 가져올 수 없습니다.");

  // outputSize로 리사이즈해서 그림
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outputSize,
    outputSize
  );

  // 캔버스를 blob로 인코딩
  // 콜백 기반이라 promise로 감싸서 await 가능하게 만듦
  // png면 quality가 의미없어서(jpeg 품질만 관여됨) undifined
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("크롭 이미지 생성 실패"))),
      mimeType,
      mimeType === "image/jpeg" ? quality : undefined
    );
  });

  // blob에서 file로 래핑해서 반환
  return new File([blob], safeFileName, {type: mimeType})
}
