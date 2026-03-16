import type { ArtistLessonDetailResp } from "../../../../../Types/artistSearchTypes";

type Props = {
  lessonDetail: ArtistLessonDetailResp | undefined;
  isLoading: boolean;
  isError: boolean;
};

function LessonDetail({ lessonDetail, isLoading, isError }: Props) {
  if (isLoading) {
    return <div>레슨 상세 불러오는 중...</div>;
  }

  if (isError) {
    return <div>레슨 상세를 불러오지 못했습니다.</div>;
  }

  if (!lessonDetail) {
    return <div>선택된 레슨이 없습니다.</div>;
  }

  return (
    <div>
      <h3>{lessonDetail.title}</h3>
      <div>{lessonDetail.mode}</div>
      <div>{lessonDetail.price.toLocaleString()}원</div>
      <div>{lessonDetail.instrument.instName}</div>
      <div>{lessonDetail.durationMin}분</div>

      <div>
        <strong>수업 정보</strong>
        <p>{lessonDetail.description ?? "수업 정보가 없습니다."}</p>
      </div>

      <div>
        <strong>준비물 / 요구사항</strong>
        <p>{lessonDetail.requirementText ?? "별도 안내사항이 없습니다."}</p>
      </div>
    </div>
  );
}

export default LessonDetail;
