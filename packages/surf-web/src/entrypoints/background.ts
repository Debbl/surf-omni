import {
  browserActionSetBadgeText,
  browserTabs,
  browserWebRequestOnErrorOccurred,
} from "~/lib";
import { storageFailedResources } from "~/lib/store";

export default defineBackground(() => {
  updateBrowserActionByCurrentProfile();

  browserTabs.onActivated.addListener(async () => {
    await storageFailedResources.set([]);
    await browser.action.setBadgeText({
      text: "",
    });

    await updateBrowserActionByCurrentProfile();
  });

  browserWebRequestOnErrorOccurred.addListener(
    async (details) => {
      const failedResources = await storageFailedResources.get();
      const url = new URL(details.url);
      const newFailedResources = Array.from(
        new Set([...failedResources, url.host]),
      );

      await browserActionSetBadgeText({
        text: `${newFailedResources.length || ""}`,
      });

      await storageFailedResources.set(newFailedResources);
    },
    { urls: ["<all_urls>"] },
  );
});
