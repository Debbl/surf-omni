import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GlobalStoreState } from "./useGlobalStore";

interface LocalStorageStoreState {
  globalStoreStore: GlobalStoreState;
}

interface LocalStorageStoreAction {
  setGlobalStoreStore: (globalStoreStore: GlobalStoreState) => void;
}
// TODO manual local storage
const useLocalStorageStore = create<
  LocalStorageStoreState & LocalStorageStoreAction
>()(
  persist(
    (set) => ({
      globalStoreStore: {
        rulesRaw: "",
        currentProxy: {
          value: { mode: "direct" },
          levelOfControl: "not_controllable",
        },
        autoProxy: "",
      } as GlobalStoreState,
      setGlobalStoreStore: (globalStoreStore) =>
        set(() => ({ globalStoreStore })),
    }),
    {
      version: 0,
      name: "local-storage",
      storage: {
        getItem: async (name: string) => {
          const value = await browser.storage.local.get(name);
          return value[name];
        },
        setItem: async (name: string, value: any) => {
          return browser.storage.local.set({ [name]: value });
        },
        removeItem: async (name: string) => {
          return browser.storage.local.remove(name);
        },
      },
    },
  ),
);

export { useLocalStorageStore };
