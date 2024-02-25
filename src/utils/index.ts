import {
  IonEarth,
  MaterialSymbolsAutorenewOutlineRounded,
  MingcuteTransferFill,
  TdesignPoweroff,
} from "@/icons";
import type { IMode } from "@/store";

export * from "./AutoProxy";
export * from "./PAC";
export * from "./generatePacScript";

export function getIconByMode(mode: IMode) {
  switch (mode) {
    case "direct":
      return MingcuteTransferFill;
    case "fixed_servers":
      return IonEarth;
    case "pac_script":
      return MaterialSymbolsAutorenewOutlineRounded;
    case "system":
      return TdesignPoweroff;
    default:
      return MingcuteTransferFill;
  }
}
