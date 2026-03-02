import { getProxyValue, preprocess } from 'surf-pac'
import { builtinProfiles } from '~/constants'
import {
  browserActionSetBadgeText,
  browserProxySettings,
  browserTabs,
  browserWebRequestOnErrorOccurred,
} from '~/lib'
import {
  settingsStoreKey,
  storageCurrentProfile,
  storageCurrentProfileName,
  storageFailedResources,
  storageProfiles,
  storageSettings,
} from '~/lib/store'
import type { FixedProfile, RuleListProfile } from 'surf-pac'

const ALARM_NAME = 'surf-omni:update-rule-lists'

async function applyCurrentProxy() {
  const currentProfileName = await storageCurrentProfileName.get()
  if (!currentProfileName) return
  const profiles = await storageProfiles.get()
  const allProfiles = { ...builtinProfiles, ...profiles }
  browserProxySettings.set({
    value: getProxyValue(currentProfileName, allProfiles),
  })
}

async function updateAllRuleLists() {
  const profiles = await storageProfiles.get()
  let hasChanges = false

  for (const [key, profile] of Object.entries(profiles)) {
    if (profile.profileType === 'RuleListProfile' && profile.url) {
      try {
        const response = await fetch(profile.url)
        const raw = await response.text()
        ;(profiles[key] as RuleListProfile).raw = preprocess(raw) ?? ''
        hasChanges = true
      } catch (e) {
        console.error(
          `[surf-omni] Failed to update rule list: ${profile.name}`,
          e,
        )
      }
    }
  }

  if (hasChanges) {
    await storageProfiles.set(profiles)
    await applyCurrentProxy()
  }
}

async function setupAlarm() {
  const settings = await storageSettings.get()
  await browser.alarms.clearAll()
  if (settings.downloadInterval > 0) {
    browser.alarms.create(ALARM_NAME, {
      periodInMinutes: settings.downloadInterval,
    })
  }
}

export default defineBackground(() => {
  setupAlarm()

  browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === ALARM_NAME) {
      await updateAllRuleLists()
    }
  })

  browser.storage.onChanged.addListener((changes) => {
    if (changes[settingsStoreKey]) {
      setupAlarm()
    }
  })

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
