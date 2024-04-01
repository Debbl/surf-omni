import { storageCurrentProfileName } from "~/lib/store";
import { browserActionSetTitle, browserTabs } from "~/lib";
import type { Tabs } from "webextension-polyfill";

export default defineBackground(() => {
  browserTabs.onActivated.addListener(
    async (activeInfo: Tabs.OnActivatedActiveInfoType) => {
      const currentProfileName = await storageCurrentProfileName.get();

      browserActionSetTitle({
        title: currentProfileName,
        tabId: activeInfo.tabId,
      });
    },
  );
});
