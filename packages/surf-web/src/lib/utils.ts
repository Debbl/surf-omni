import { twMerge } from "tailwind-merge";
import { cx } from "class-variance-authority";
import { AutorenewOutlineRounded, Earth } from "~/icons";
import type { ProfileType } from "surf-pac";
import type { ClassValue } from "class-variance-authority/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(cx(inputs));
}

export function getIconByProfileType(type: ProfileType) {
  switch (type) {
    case "FixedProfile":
      return Earth;
    case "SwitchProfile":
      return AutorenewOutlineRounded;
  }
}
