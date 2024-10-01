import { nameAsKey } from "surf-pac";
import { builtinProfiles } from "~/constants";
import { AutorenewOutlineRounded, Earth } from "~/icons";
import { storageCurrentProfileName, storageProfiles } from "~/lib";
import {
  browserActionSetIcon,
  browserActionSetTitle,
  browserDownloads,
} from "../lib/browser";
import type { Profile, ProfileType } from "surf-pac";
import type { Action } from "wxt/browser";

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

export function drawSurfOmniIcon(
  innerCircleColor: string,
  outerCircleColor: string = "#aaa",
  size: number = 64,
) {
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext("2d")!;

  const center = size / 2;
  const outerRadius = size / 2;
  const innerRadius = size / 4;

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = outerCircleColor;
  ctx.beginPath();
  ctx.arc(center, center, outerRadius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = innerCircleColor;
  ctx.beginPath();
  ctx.arc(center, center, innerRadius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();

  return ctx.getImageData(0, 0, size, size) as Action.ImageDataType;
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

export async function updateBrowserAction(profile: Profile) {
  await browserActionSetTitle({
    title: profile.name,
  });

  // Generate icons in different sizes
  const sizes = [16, 32, 48, 64];
  const imageData: Record<string, Action.ImageDataType> = Object.fromEntries(
    sizes.map((size) => [
      size.toString(),
      drawSurfOmniIcon(profile.color, "#aaa", size),
    ]) as [string, Action.ImageDataType][],
  );

  await browserActionSetIcon({
    imageData,
  });
}

export async function updateBrowserActionByCurrentProfile() {
  const currentProfile = await getCurrentProfile();
  updateBrowserAction(currentProfile);
}
