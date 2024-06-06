import { storageCurrentProfile, storageFailedResources } from "~/lib/store";
import {
  browserActionSetBadgeText,
  browserTabs,
  browserWebRequestOnErrorOccurred,
  updateBrowserAction,
} from "~/lib";

export default defineBackground(() => {
  browserTabs.onActivated.addListener(async () => {
    const currentProfile = await storageCurrentProfile.get();

    await storageFailedResources.set([]);
    await browser.action.setBadgeText({
      text: "",
    });

    updateBrowserAction(currentProfile);
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
