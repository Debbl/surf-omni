import { create } from "zustand";
import { persist } from "zustand/middleware";
import { autoProxy, generatePacScript } from "@/utils";
import type { Types } from "wxt/browser";

export type IMode =
  | "direct"
  | "system"
  | "auto_detect"
  | "pac_script"
  | "fixed_servers";

interface SettingGetCallbackDetailsType
  extends Types.SettingGetCallbackDetailsType {
  value: {
    mode: IMode;
  };
}

export interface GlobalStoreState {
  rulesRaw: string;
  currentProxy: SettingGetCallbackDetailsType;
  autoProxy: string;
}

export interface GlobalStoreAction {
  getProxy: () => Promise<SettingGetCallbackDetailsType>;
  setMode: (mode: IMode) => Promise<void>;
  parserAutoProxy: () => Promise<boolean>;
  setAutoProxy: (autoProxy: string) => void;
}

const useGlobalStore = create<GlobalStoreState & GlobalStoreAction>()(
  persist(
    (set, get) => ({
      rulesRaw: "",
      currentProxy: {
        value: { mode: "direct" },
        levelOfControl: "not_controllable",
      },
      autoProxy: "",
      setMode: async (mode: IMode) => {
        switch (mode) {
          case "direct":
            await browser.proxy.settings.set({
              value: { mode: "direct" },
            });
            break;
          case "system":
            await browser.proxy.settings.set({
              value: { mode: "system" },
            });
            break;
          case "fixed_servers":
            await browser.proxy.settings.set({
              value: {
                mode: "fixed_servers",
                rules: {
                  singleProxy: {
                    scheme: "http",
                    host: "127.0.0.1",
                    port: 7890,
                  },
                },
              },
            });
            break;
          case "auto_detect":
            break;
          case "pac_script":
            if (autoProxy.detect(get().rulesRaw)) {
              browser.proxy.settings.set({
                value: {
                  mode: "pac_script",
                  pacScript: {
                    data: generatePacScript(
                      "127.0.0.1:7890",
                      autoProxy.parse(get().rulesRaw),
                    ),
                  },
                },
                scope: "regular",
              });
            }
            break;
          default:
            // eslint-disable-next-line no-case-declarations
            const _exhaustiveCheck: never = mode;
            break;
        }
      },
      getProxy: async () => await browser.proxy.settings.get({}),
      setAutoProxy: (autoProxy) => {
        set(() => ({ autoProxy }));
      },
      parserAutoProxy: async () => {
        const preProxy = get().currentProxy;

        await get().setMode("fixed_servers");

        const currentAutoProxy = get().autoProxy;
        if (!currentAutoProxy) return false;

        try {
          const response = await fetch(currentAutoProxy);
          const text = await response.text();

          set(() => ({ rulesRaw: autoProxy.preprocess(text) }));
        } catch {
          return false;
        } finally {
          await get().setMode(preProxy.value.mode);
        }
        return true;
      },
    }),
    {
      version: 0,
      name: "global-storage",
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

browser.proxy.settings.onChange.addListener((e) => {
  useGlobalStore.setState((s) => ({
    ...s,
    currentProxy: e,
  }));
});

export { useGlobalStore };
