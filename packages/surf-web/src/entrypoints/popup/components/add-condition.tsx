import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { useEffect, useMemo, useState } from 'react'
import { useSwitchProfile } from '~/atoms/hooks/use-switch-profile'
import { conditionType } from '~/constants'
import { browserTabs, saveToLocal } from '~/lib'
import { getIconByProfileType } from '~/utils'
import type { Condition, SwitchProfile } from 'surf-pac'

export default function AddCondition({
  name,
  setIsShowAddCondition,
}: {
  name: string
  setIsShowAddCondition: (isShowAddCondition: boolean) => void
}) {
  const { switchProfile, setSwitchProfile, matchProfileNames } =
    useSwitchProfile<SwitchProfile>(name)

  const Icon = useMemo(
    () => getIconByProfileType(switchProfile.profileType),
    [switchProfile.profileType],
  )

  const [condition, setCondition] = useState<Condition>({
    conditionType: 'HostWildcardCondition',
    pattern: '',
  })
  const [profileName, setProfileName] = useState(matchProfileNames[0].value)

  const isExistRule = useMemo(() => {
    return switchProfile.rules.some(
      (rule) =>
        rule.condition.conditionType === condition.conditionType &&
        rule.condition.pattern === condition.pattern &&
        rule.profileName === profileName,
    )
  }, [condition, profileName, switchProfile.rules])

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setProfileName(matchProfileNames[0].value)
  }, [matchProfileNames])

  useEffect(() => {
    ;(async () => {
      const activeTabs = await browserTabs.query({
        active: true,
        currentWindow: true,
      })
      if (!activeTabs[0].url) return

      const url = new URL(activeTabs[0].url)
      const pattern = url.host.split('.').slice(-2).join('.')

      setCondition((c) => ({
        ...c,
        pattern: `*.${pattern}`,
      }))
    })()
  }, [])

  const handleAddCondition = () => {
    if (!profileName) return

    setSwitchProfile({
      ...switchProfile,
      rules: [
        ...switchProfile.rules,
        {
          condition,
          profileName,
        },
      ],
    })
    saveToLocal()
    setIsShowAddCondition(false)
    browserTabs.reload()
  }

  return (
    <div className='flex min-w-72 flex-col gap-y-4 px-2'>
      <div className='flex flex-col gap-x-2 p-2 text-lg'>
        <div>添加条件到情景模式</div>
        <div className='flex items-center gap-x-2'>
          {Icon && <Icon />}
          <span>{switchProfile.name}</span>
        </div>
      </div>

      <div className='flex flex-col gap-y-6'>
        <Select
          size='sm'
          label='选择条件类型'
          selectedKeys={[condition.conditionType]}
          onChange={(e) =>
            setCondition((c) => ({
              ...c,
              conditionType: e.target.value as Condition['conditionType'],
            }))
          }
        >
          {conditionType.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </Select>

        <Input
          size='sm'
          type='text'
          label='条件设置'
          placeholder='请输入条件设置'
          value={condition.pattern}
          onValueChange={(v) => setCondition((c) => ({ ...c, pattern: v }))}
        />

        <Select
          size='sm'
          label='选择情景模式'
          selectedKeys={[profileName]}
          onChange={(e) => setProfileName(e.target.value)}
        >
          {matchProfileNames.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className='flex items-center justify-between py-4'>
        <Button onClick={() => setIsShowAddCondition(false)}>取消</Button>
        <Button
          isDisabled={isExistRule}
          color='primary'
          onClick={() => handleAddCondition()}
        >
          确定
        </Button>
      </div>
    </div>
  )
}
