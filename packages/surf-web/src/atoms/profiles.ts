import { atom } from "jotai";
import type { Profiles } from "surf-pac";

export const profilesStoreKey = "profiles";
export const profilesAtom = atom<Profiles>({});
