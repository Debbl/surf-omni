import {
  browserActionSetBadgeText,
  browserTabs,
  browserWebRequestOnErrorOccurred,
} from '~/lib'
import { storageCurrentProfile, storageFailedResources } from '~/lib/store'
import type { FixedProfile } from 'surf-pac'

export default defineBackground(() => {
  updateBrowserActionByCurrentProfile()

  browser.webRequest.onAuthRequired.addListener(
    (details, callback) => {
      if (!details.isProxy) {
        callback?.({})
        return undefined
      }

      storageCurrentProfile
        .get()
        .then((profile) => {
          if (
            profile.profileType === 'FixedProfile' &&
            (profile as FixedProfile).singleProxy.username
          ) {
            const { username, password } = (profile as FixedProfile).singleProxy
            callback?.({
              authCredentials: {
                username: username!,
                password: password ?? '',
              },
            })
          } else {
            callback?.({})
          }
        })
        .catch(() => {
          callback?.({})
        })
    },
    { urls: ['<all_urls>'] },
    ['asyncBlocking'],
  )

  browserTabs.onActivated.addListener(async () => {
    await storageFailedResources.set([])
    await browser.action.setBadgeText({
      text: '',
    })

    await updateBrowserActionByCurrentProfile()
  })

  browserTabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.url && tab.active) {
      await updateBrowserActionByCurrentProfile()
    }
  })

  browserWebRequestOnErrorOccurred.addListener(
    async (details) => {
      const failedResources = await storageFailedResources.get()
      const url = new URL(details.url)
      const newFailedResources = Array.from(
        new Set([...failedResources, url.host]),
      )

      await browserActionSetBadgeText({
        text: `${newFailedResources.length || ''}`,
      })

      await storageFailedResources.set(newFailedResources)
    },
    { urls: ['<all_urls>'] },
  )
})
