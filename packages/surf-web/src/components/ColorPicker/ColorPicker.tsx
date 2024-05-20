import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useCallback, useState } from "react";
import Palette from "./Palette";
import Bar from "./Bar";
import type { Hsva } from "~/lib/color";
import { formatInputToHSVA, hsvToRgb, rgbToHex } from "~/lib/color";

export default function ColorPicker({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  const [color, _setColor] = useState(formatInputToHSVA(value));
  const setColor = useCallback(
    (v: Hsva) => {
      _setColor(v);
      setValue(`#${rgbToHex(hsvToRgb(v))}`);
    },
    [setValue],
  );

  return (
    <Popover radius="none">
      <PopoverTrigger>
        <div
          className="size-6 cursor-pointer rounded-md border"
          style={{ backgroundColor: `#${rgbToHex(hsvToRgb(color))}` }}
        />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col overflow-hidden p-0">
        <Palette color={color} setColor={setColor} />
        <Bar color={color} setColor={setColor} />
      </PopoverContent>
    </Popover>
  );
}
