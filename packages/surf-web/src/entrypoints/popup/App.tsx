import { Button, Spinner } from '@nextui-org/react'
import { useAtom } from 'jotai'
import { Fragment, useEffect, useState } from 'react'
import { getProxyValue, nameAsKey } from 'surf-pac'
import { currentProfileNameAtom } from '~/atoms/currentProfileName'
import { failedResourcesAtom } from '~/atoms/failedResources'
import { useLoadFormLocal } from '~/atoms/hooks/useLoadFormLocal'
import { useProfiles } from '~/atoms/hooks/useProfiles'
import {
  Icon,
  Plus,
  PowerOff,
  RoundWarning,
  Settings,
  TransferFill,
} from '~/icons'
import { browserProxySettings, browserTabs, getIconByProfileType } from '~/lib'
import AddCondition from './components/AddCondition'
import FailedResources from './components/FailedResources'
import type { ButtonGroupProps } from '@nextui-org/react'
import type { Tabs } from 'wxt/browser'
import type { IIcon } from '~/icons'

async function handleOpenSetting() {
  const url = `chrome-extension://${browser.runtime.id}/index.html`
  const tabs = await browserTabs.query({ url })

  if (tabs.length !== 0) {
    await browserTabs.update(tabs[0].id, { active: true })
  } else {
    browserTabs.create({
      url,
    })
  }
}

export default function App() {
  const { isLoading } = useLoadFormLocal()
  const { currentProfile, showProfiles, allProfiles } = useProfiles()
  const [currentProfileName, setCurrentProfileName] = useAtom(
    currentProfileNameAtom,
  )
  const [isShowAddCondition, setIsShowAddCondition] = useState(false)
  const [isShowFailedResources, setIsShowFailedResources] = useState(false)
  const [activeTabs, setActiveTabs] = useState<
    (Tabs.Tab & { URL: URL | null })[]
  >([])
  const [failedResources, setFailedResources] = useAtom(failedResourcesAtom)

  const isSwitchProfile =
    currentProfile.profileType === 'SwitchProfile' &&
    ['http:', 'https:'].includes(activeTabs[0].URL?.protocol || '')

  const isWebExtension = activeTabs[0]?.URL?.protocol.includes('extension:')

  useEffect(() => {
    ;(async () => {
      const activeTabs = await browserTabs.query({
        active: true,
        currentWindow: true,
      })

      setActiveTabs(
        activeTabs.map((tab) => ({
          ...tab,
          URL: tab.url ? new URL(tab.url) : null,
        })),
      )
    })()
  }, [])

  const menu: {
    name: string
    children: {
      name: string
      icon?: IIcon
      profileName?: string
      color?: ButtonGroupProps['color']
      onClick?: () => void
    }[]
  }[] = [
    {
      name: 'BuiltinProfiles',
      children: [
        {
          name: '直接连接',
          icon: TransferFill,
          profileName: '[direct]',
        },
        {
          name: '系统代理',
          icon: PowerOff,
          profileName: '[system]',
        },
        ...(failedResources.length
          ? [
              {
                name: `${failedResources.length}个资源未加载`,
                icon: RoundWarning,
                color: 'warning' as const,
                onClick: () => setIsShowFailedResources(true),
              },
            ]
          : []),
      ],
    },
    {
      name: 'Profiles',
      children: [
        ...Object.values(showProfiles).map(({ name, profileType }) => ({
          name,
          icon: getIconByProfileType(profileType),
          profileName: name,
        })),
      ],
    },
    ...(isSwitchProfile
      ? [
          {
            name: 'Condition',
            children: [
              {
                name: '添加条件',
                icon: Plus,
                onClick: () => setIsShowAddCondition(true),
              },
            ],
          },
        ]
      : []),
    {
      name: 'Actions',
      children: [
        {
          name: '选项',
          icon: Settings,
          onClick: handleOpenSetting,
        },
      ],
    },
  ]

  const handleClick = async (profileName: string) => {
    if (currentProfileName === profileName) return

    setCurrentProfileName(profileName)
    await browserProxySettings.set({
      value: getProxyValue(profileName, allProfiles),
    })
    await updateBrowserAction(allProfiles[nameAsKey(profileName)])

    setFailedResources([])
    if (!isWebExtension) await browserTabs.reload()

    window.close()
  }

  if (isLoading) return <Spinner className='h-screen w-full' label='loading' />

  if (isShowAddCondition)
    return (
      <AddCondition
        name={currentProfileName}
        setIsShowAddCondition={setIsShowAddCondition}
      />
    )

  if (isShowFailedResources)
    return (
      <FailedResources
        name={currentProfileName}
        isDisabled={!isSwitchProfile}
        setIsShowFailedResources={setIsShowFailedResources}
      />
    )

  return (
    <>
      <ul className='flex flex-col gap-y-1 py-1'>
        {menu.map((item, index) => (
          <Fragment key={item.name}>
            {item.children.length !== 0 && index !== 0 && (
              <li className='border-b' />
            )}
            {item.children.map((i) => (
              <li key={i.name}>
                <Button
                  className='w-full justify-start'
                  variant={
                    currentProfileName === i.profileName ? 'solid' : 'light'
                  }
                  color={
                    i.color ||
                    (currentProfileName === i.profileName
                      ? 'primary'
                      : 'default')
                  }
                  onClick={() => {
                    if (i.onClick) {
                      i.onClick()
                    } else {
                      if (i.profileName) handleClick(i.profileName)
                    }
                  }}
                  startContent={
                    i.icon && <Icon className='size-4' icon={i.icon} />
                  }
                >
                  {i.name}
                </Button>
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
    </>
  )
}
