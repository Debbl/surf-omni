import { atom } from "jotai";

export const failedResourcesKey = "failedResources";
export const failedResourcesAtom = atom<string[]>([]);
