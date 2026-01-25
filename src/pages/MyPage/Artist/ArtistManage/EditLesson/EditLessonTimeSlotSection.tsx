import TimeSlotCreatePanel from "../common/TimeSlots/TimeSlotCreatePanel/TimeSlotCreatePanel";
import TimeSlotSelectedList from "../common/TimeSlots/TimeSlotSelectedList/TimeSlotSelectedList";

type Props = {
  durationMin: number;
  startDts: string[];
  onAdd: (dtLocal: string) => void;
  onAddMany: (dts: string[]) => void;
  onRemove: (dt: string) => void;
  onClear: () => void;
};
function EditLessonTimeSlotSection({
  durationMin,
  startDts,
  onAdd,
  onAddMany,
  onRemove,
  onClear,
}: Props) {
  return (
    <>
      <TimeSlotCreatePanel
        durationMin={durationMin}
        onAdd={onAdd}
        onAddMany={onAddMany}
      />
      <hr style={{ margin: "20px 0" }} />
      <TimeSlotSelectedList
        startDts={startDts}
        onRemove={onRemove}
        onClear={onClear}
      />
    </>
  );
}

export default EditLessonTimeSlotSection;
