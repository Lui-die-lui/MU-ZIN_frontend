import { useQuery } from "@tanstack/react-query";
import {
  EMPTY_STYLE_TAGS,
  type LessonStyleTagResponse,
} from "../../../../Types/lessonTypes";
import {
  getLessonStyleTags,
  getLessonStyleTagsReq,
} from "../../../../apis/lesson/lessonApis";
import MultiSelectDropdown from "../../../../components/common/MultiSelectDropdown/MultiSelectDropdown";
type Props = {
  lessonStyleTagIds: number[];
  onChangeStyleTagIds: (ids: number[]) => void;
};

function StyleDropdown({ lessonStyleTagIds, onChangeStyleTagIds }: Props) {
  const { data: styleTags = EMPTY_STYLE_TAGS, isFetching } = useQuery<
    LessonStyleTagResponse[]
  >({
    queryKey: ["lessonStyleTags"],
    queryFn: getLessonStyleTags,
    staleTime: 1 * 60 * 1000,
  });
  return (
    <MultiSelectDropdown<LessonStyleTagResponse>
      label="스타일 선택"
      selectedCountLabel={(n) => `스타일 ${n}개 선택됨`}
      searchPlaceholder="스타일 검색"
      items={styleTags}
      isLoading={isFetching}
      getId={(item) => item.lessonStyleTagId}
      getLabel={(item) => item.styleName}
      selectedIds={lessonStyleTagIds}
      onChangeSelectedIds={onChangeStyleTagIds}
    />
  );
}

export default StyleDropdown;
