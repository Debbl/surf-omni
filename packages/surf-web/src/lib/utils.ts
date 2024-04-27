import { twMerge } from "tailwind-merge";
import { cx } from "class-variance-authority";
import type { ProfileType } from "surf-pac";
import type { ClassValue } from "class-variance-authority/types";
import { browserDownloads } from "./browser";
import { AutorenewOutlineRounded, Earth } from "~/icons";

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

export async function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  await browserDownloads.download({
    url,
    saveAs: true,
    filename,
  });
}
