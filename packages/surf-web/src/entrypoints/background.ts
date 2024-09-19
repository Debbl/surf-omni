import {
  browserActionSetBadgeText,
  browserTabs,
  browserWebRequestOnErrorOccurred,
  updateBrowserAction,
} from "~/lib";
import { storageFailedResources } from "~/lib/store";

export default defineBackground(() => {
  browserTabs.onActivated.addListener(async () => {
    const currentProfile = await getCurrentProfile();

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
