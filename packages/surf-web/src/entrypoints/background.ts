import type { Tabs } from "webextension-polyfill";
import { storageCurrentProfileName } from "~/lib/store";
import { browserActionSetTitle, browserTabs, drawSurfOmniIcon } from "~/lib";

export default defineBackground(() => {
  browserTabs.onActivated.addListener(
    async (activeInfo: Tabs.OnActivatedActiveInfoType) => {
      const currentProfileName = await storageCurrentProfileName.get();

      browserActionSetTitle({
        title: currentProfileName,
        tabId: activeInfo.tabId,
      });

      const imageData = drawSurfOmniIcon("#0f0");
      browser.action.setIcon({
        imageData,
      });
    },
  );
});
