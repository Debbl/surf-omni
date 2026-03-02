import { Input } from '@heroui/react'
import { useEffect, useState } from 'react'
import { storageSettings } from '~/lib/store'
import type { Settings } from '~/lib/store'

export default function General() {
  const [settings, setSettings] = useState<Settings>({ downloadInterval: 0 })

  useEffect(() => {
    storageSettings.get().then(setSettings)
  }, [])

  const handleIntervalChange = async (value: string) => {
    const downloadInterval = Math.max(0, Number(value) || 0)
    const next = { ...settings, downloadInterval }
    setSettings(next)
    await storageSettings.set(next)
  }

  return (
    <>
      <div>
        <div className='py-6'>
          <h2 className='text-2xl font-medium'>常规设置</h2>
        </div>
        <div className='border-b'></div>
      </div>

      <main className='pt-4'>
        <div className='flex flex-col gap-y-4'>
          <div>
            <div className='mb-2 text-sm text-gray-500'>
              规则列表自动更新间隔（分钟），0 表示禁用
            </div>
            <Input
              size='sm'
              type='number'
              label='自动更新间隔（分钟）'
              className='w-60'
              min={0}
              value={String(settings.downloadInterval)}
              onValueChange={handleIntervalChange}
            />
          </div>
        </div>
      </main>
    </>
  )
}
