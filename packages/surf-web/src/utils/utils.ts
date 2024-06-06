import type { ProfileType } from "surf-pac";
import { nameAsKey } from "surf-pac";
import type { Action } from "wxt/browser";
import { browserDownloads } from "../lib/browser";
import { AutorenewOutlineRounded, Earth } from "~/icons";
import { storageCurrentProfileName, storageProfiles } from "~/lib";
import { builtinProfiles } from "~/constants";

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

export function drawCritical(
  ctx: OffscreenCanvasRenderingContext2D,
  innerCircleColor: string,
  outerCircleColor: string,
) {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = outerCircleColor;
  ctx.beginPath();
  ctx.arc(8, 8, 4, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();

  if (innerCircleColor != null) {
    ctx.fillStyle = innerCircleColor;
  } else {
    ctx.globalCompositeOperation = "destination-out";
  }

  ctx.beginPath();
  ctx.arc(8, 8, 8, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

export function drawSurfOmniIcon(
  innerCircleColor: string,
  outerCircleColor: string = "#eee",
) {
  const canvas = new OffscreenCanvas(16, 16);
  const ctx = canvas.getContext("2d")!;

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = outerCircleColor;
  ctx.beginPath();
  ctx.arc(8, 8, 4, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();

  if (innerCircleColor != null) {
    ctx.fillStyle = innerCircleColor;
  } else {
    ctx.globalCompositeOperation = "destination-out";
  }

  ctx.beginPath();
  ctx.arc(8, 8, 8, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();

  return ctx.getImageData(0, 0, 16, 16) as Action.ImageDataType;
}

export async function getCurrentProfile() {
  const currentProfileName = await storageCurrentProfileName.get();
  const profiles = await storageProfiles.get();

  const allProfiles = {
    ...builtinProfiles,
    ...profiles,
  };

  return allProfiles[nameAsKey(currentProfileName)] ?? {};
}
