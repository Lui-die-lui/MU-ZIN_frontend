/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { IoChevronDown } from "react-icons/io5";
import { useId, useMemo, useState, type ReactNode } from "react";

export type AccordionItem = {
  id: string; // 조합을 위해 string 으로
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

type Props = {
  items: AccordionItem[]; // 탭 목록 데이터
  allowMultiple?: boolean; // 탭을 동시에 여러개 열 수 있는가 설정
  defaultOpenIds?: string[]; // 처음 화면 렌더링 시 어떤 탭을 열어둘지
  openIds?: string[]; // 현재 열려있는 탭 id 목록을 부모가 직접 들고있게 함
  onChangeOpenIds?: (next: string[]) => void; // 탭을 클릭해서 열림 상태가 바뀔때 다음상태를 지정
};

// 오픈탭 UI
function Accordion({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
  openIds,
  onChangeOpenIds,
}: Props) {
  const baseId = useId();
  const isControlled = openIds !== undefined;

  const [innerOpenIds, setInnerOpenIds] = useState<string[]>(defaultOpenIds);

  const currentOpenIds = isControlled ? openIds : innerOpenIds;

  const openSet = useMemo(() => new Set(currentOpenIds), [currentOpenIds]);

  const setOpenIds = (next: string[]) => {
    if (isControlled) onChangeOpenIds?.(next);
    else setInnerOpenIds(next);
  };

  const toggle = (id: string) => {
    const isOpen = openSet.has(id);

    if (allowMultiple) {
      // 탭이 여러개 열릴 때
      const next = isOpen
        ? currentOpenIds.filter((x) => x !== id)
        : [...currentOpenIds, id];
      setOpenIds(next);
      return;
    }

    // 단일로 열릴 때
    setOpenIds(isOpen ? [] : [id]);
  };
  return (
    <div css={s.wrap}>
      {items.map((item) => {
        const isOpen = openSet.has(item.id);
        const headerId = `${baseId}-h-${item.id}`;
        const panelId = `${baseId}-p-${item.id}`;

        return (
          <div key={item.id} css={s.item}>
            <button
              type="button"
              css={s.header(!!item.disabled)}
              onClick={() => !item.disabled && toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              id={headerId}
              disabled={item.disabled}
            >
              <span css={s.title}>{item.title}</span>
              <IoChevronDown css={s.icon(isOpen)} />
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              css={s.panel(isOpen)}
            >
              <div css={s.panelInner(isOpen)}>{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
