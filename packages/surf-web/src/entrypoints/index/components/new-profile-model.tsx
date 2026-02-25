import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
} from '@heroui/react'
import { useEffect, useState } from 'react'
import { ProfileIcon } from '~/components/profile-icon'
import type { BuiltinProfileType, ProfileType } from 'surf-pac'

export type OptionProfileType = Exclude<ProfileType, BuiltinProfileType>
export type OnOk = (value: {
  name: string
  profileType: OptionProfileType
}) => void

export function NewProfileModel(props: {
  open: boolean
  setOpen: (open: boolean) => void
  onOk?: OnOk
}) {
  const { open, setOpen, onOk } = props
  const [name, setName] = useState('')
  const [profileType, setProfileType] =
    useState<OptionProfileType>('FixedProfile')

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setName('')
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setProfileType('FixedProfile')
    }
  }, [open])

  const handleOk = () => {
    if (!name) return

    onOk?.({ name, profileType })
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <ModalContent>
        <ModalHeader>新建情景模式</ModalHeader>

        <ModalBody className='gap-y-6'>
          <Input
            label='情景模式名称'
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <RadioGroup
            label='请选择情景模式的类型:'
            value={profileType}
            onValueChange={setProfileType as (v: string) => void}
            classNames={{
              label: 'text-lg',
              wrapper: 'gap-y-4',
            }}
          >
            <Radio value='FixedProfile' description='经过代理服务器访问网站。'>
              <div className='flex items-center gap-x-2'>
                <ProfileIcon profileType='FixedProfile' />
                代理服务器
              </div>
            </Radio>
            <Radio
              value='SwitchProfile'
              description='根据多种条件，如域名或网址等自动选择情景模式。您也可以导入在线发布的切换规则（如 AutoProxy 列表）以简化设置。'
            >
              <div className='flex items-center gap-x-2'>
                <ProfileIcon profileType='SwitchProfile' />
                自动切换模式
              </div>
            </Radio>
          </RadioGroup>
        </ModalBody>

        <ModalFooter>
          <Button
            className='w-20 justify-center'
            variant='flat'
            onClick={() => setOpen(false)}
          >
            取消
          </Button>
          <Button
            className='w-20 justify-center'
            color='success'
            onClick={() => handleOk()}
          >
            确定
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
