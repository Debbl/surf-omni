import { atom } from "jotai";
import type { Profiles } from "~/types";

export const profilesStoreKey = "profiles";
export const profilesAtom = atom<Profiles>({});
