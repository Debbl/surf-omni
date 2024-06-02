import { storageCurrentProfile, storageFailedResources } from "~/lib/store";
import { browserTabs, updateBrowserAction } from "~/lib";

export default defineBackground(() => {
  browserTabs.onActivated.addListener(async () => {
    const currentProfile = await storageCurrentProfile.get();

    await storageFailedResources.set([]);
    await browser.action.setBadgeText({
      text: "",
    });

    updateBrowserAction(currentProfile);
  });

  browser.webRequest.onErrorOccurred.addListener(
    async (details) => {
      const failedResources = await storageFailedResources.get();
      const url = new URL(details.url);
      const newFailedResources = Array.from(
        new Set([...failedResources, url.host]),
      );

      await browser.action.setBadgeText({
        text: `${newFailedResources.length}`,
      });

      await storageFailedResources.set(newFailedResources);
    },
    { urls: ["<all_urls>"] },
  );
});
