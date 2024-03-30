import { storageCurrentProfileName } from "~/lib/store";
import { setActionTitle } from "~/lib/utils";
import type { Tabs } from "webextension-polyfill";

export default defineBackground(() => {
  browser.tabs.onActivated.addListener(
    async (activeInfo: Tabs.OnActivatedActiveInfoType) => {
      const currentProfileName = await storageCurrentProfileName.get();

      setActionTitle({
        title: currentProfileName,
        tabId: activeInfo.tabId,
      });
    },
  );
});
