import { storageCurrentProfile } from "~/lib/store";
import { browserTabs, updateBrowserAction } from "~/lib";

export default defineBackground(() => {
  browserTabs.onActivated.addListener(async () => {
    const currentProfile = await storageCurrentProfile.get();

    updateBrowserAction(currentProfile);
  });
});
