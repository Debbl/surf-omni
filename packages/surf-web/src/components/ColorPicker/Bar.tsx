import { useControlBlock } from "~/hooks/useControlBlock";
import type { Hsva } from "~/lib/color";

export default function Bar({
  color,
  setColor,
}: {
  color: Hsva;
  setColor: (color: Hsva) => void;
}) {
  const { h } = color;

  const { blockRef, handlerRef, onMouseDown } = useControlBlock({
    value: [h, 0],
    onChange: (value) => {
      setColor({
        ...color,
        h: value[0],
        a: 1,
      });
    },
  });

  return (
    <div className="my-2 w-full px-2">
      <div
        ref={blockRef}
        onMouseDown={onMouseDown as any}
        className="relative h-2 w-full cursor-pointer rounded-sm bg-bar"
      >
        <div
          ref={handlerRef}
          className="absolute size-2 -translate-x-1/2 rounded-full border border-white bg-transparent"
          style={{
            left: `${h * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
