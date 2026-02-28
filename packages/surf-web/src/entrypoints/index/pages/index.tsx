import { Button } from '@heroui/react'
import { useAtom } from 'jotai'
import { SlidersHorizontal } from 'lucide-react'
import { Fragment, useState } from 'react'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import { useProfiles } from '~/atoms/hooks/use-profiles'
import { isSettingsChangeAtom } from '~/atoms/is-settings-change'
import { Check, CloseCircleOutlined, Export, Icon, Plus } from '~/icons'
import { resetFromLocal, saveToLocal } from '~/lib/store'
import { getIconByProfileType } from '~/utils'
import { NewProfileModel } from '../components/new-profile-model'
import type { ButtonProps } from '@heroui/react'
import type { OnOk } from '../components/new-profile-model'
import type { IIcon } from '~/icons'

export default function Index() {
  const [isOpenModel, setIsOpenModel] = useState(false)
  const { showProfiles, addProfile } = useProfiles()
  const [isSettingsChange] = useAtom(isSettingsChangeAtom)

  const navigate = useNavigate()
  const { name } = useParams()

  const handleOk: OnOk = ({ name, profileType }) => {
    addProfile({ name, profileType })
    setIsOpenModel(false)

    navigate(`/profile/${name}`)
  }

  const Menu: {
    name: string
    divider?: boolean
    children: {
      name: string
      icon?: IIcon
      variant?: ButtonProps['variant']
      color?: ButtonProps['color']
      disabled?: ButtonProps['disabled']
      onClick?: () => void
    }[]
  }[] = [
    {
      name: 'SETTINGS',
      divider: true,
      children: [
        {
          name: '常规设置',
          icon: SlidersHorizontal,
          variant: 'light',
          onClick: () => navigate('/settings/general'),
        },
        {
          name: '导入/导出',
          icon: Export,
          variant: 'light',
          onClick: () => navigate('/settings/import-and-export'),
        },
      ],
    },
    {
      name: '情景模式',
      children: [
        ...Object.entries(showProfiles).map(
          ([_key, { name: profileName, profileType }]) => ({
            name: profileName,
            icon: getIconByProfileType(profileType),
            variant:
              name === profileName
                ? 'solid'
                : ('light' as ButtonProps['variant']),
            color: (name === profileName
              ? 'primary'
              : undefined) as ButtonProps['color'],
            onClick: () => navigate(`/profile/${profileName}`),
          }),
        ),
        {
          name: '新建情景模式',
          icon: Plus,
          variant: 'light',
          onClick: () => setIsOpenModel(true),
        },
      ],
    },
    {
      name: 'ACTIONS',
      divider: true,
      children: [
        {
          name: '应用选项',
          icon: Check,
          variant: 'flat',
          disabled: !isSettingsChange,
          color: isSettingsChange ? 'success' : undefined,
          onClick: () => saveToLocal(),
        },
        {
          name: '撤销更改',
          icon: CloseCircleOutlined,
          variant: 'light',
          disabled: !isSettingsChange,
          color: isSettingsChange ? 'danger' : undefined,
          onClick: () => resetFromLocal(),
        },
      ],
    },
  ]

  return (
    <>
      <NewProfileModel
        open={isOpenModel}
        setOpen={setIsOpenModel}
        onOk={handleOk}
      />

      <div className='flex h-screen'>
        <aside className='w-60 px-8 py-4'>
          <Link to='/about'>
            <h1 className='text-3xl font-bold'>Surf Omni</h1>
          </Link>

          <nav className='pt-6'>
            <ul className='flex flex-col gap-y-1'>
              {Menu.map((item, index) => (
                <Fragment key={item.name}>
                  {item.divider && index !== 0 && (
                    <li className='my-2 border-b' />
                  )}

                  <li className='py-2 font-mono text-gray-600'>{item.name}</li>
                  {item.children.map((i) => (
                    <li key={i.name}>
                      <Button
                        className='w-full justify-start'
                        variant={i.variant}
                        onClick={i.onClick}
                        color={i.color}
                        disabled={i.disabled}
                        startContent={i.icon && <Icon icon={i.icon} />}
                      >
                        {i.name}
                      </Button>
                    </li>
                  ))}
                </Fragment>
              ))}
            </ul>
          </nav>
        </aside>

        <main className='h-full flex-1 overflow-y-scroll'>
          <Outlet />
        </main>
      </div>
    </>
  )
}
