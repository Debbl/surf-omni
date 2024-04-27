import type { Action } from "wxt/browser";
import { projectName } from "~/constants";

export const browserActionSetTitle = (details: Action.SetTitleDetailsType) => {
  browser.action.setTitle({
    title: `${projectName}::${details.title}`,
    tabId: details.tabId,
  });
};
export const browserStorageLocal = browser.storage.local;
export const browserTabs = browser.tabs;
export const browserProxySettings = browser.proxy.settings;
export const browserDownloads = browser.downloads;
