import { projectName } from '~/constants'
import type { Browser } from 'wxt/browser'

export const browserStorageLocal = browser.storage.local
export const browserTabs = browser.tabs
export const browserProxySettings = browser.proxy.settings
export const browserDownloads = browser.downloads
export const browserAction = browser.action
export const browserActionSetIcon = browserAction.setIcon
export const browserWebRequestOnErrorOccurred =
  browser.webRequest.onErrorOccurred
export const browserActionSetBadgeText = browser.action.setBadgeText

export const browserActionSetTitle = async (
  details: Browser.action.TitleDetails,
) => {
  await browserAction.setTitle({
    title: `${projectName}::${details.title}`,
    tabId: details.tabId,
  })
}
