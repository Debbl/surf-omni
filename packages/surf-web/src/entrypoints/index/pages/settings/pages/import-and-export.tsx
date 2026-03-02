import { Button } from '@heroui/react'
import { useProfiles } from '~/atoms/hooks/use-profiles'
import { projectName } from '~/constants'
import { saveToLocal, storageCurrentProfileName } from '~/lib'
import { settingsStoreKey, storageSettings } from '~/lib/store'
import { downloadFile } from '~/utils'

function triggerSelectFile() {
  return new Promise<File | undefined>((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.bak'
    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement
      resolve(target?.files?.[0])
    })
    input.click()
  })
}

export default function ImportAndExport() {
  const { profiles, setProfiles } = useProfiles()

  const handleImport = async () => {
    const backFile = await triggerSelectFile()
    if (!backFile) return

    const content = JSON.parse(await backFile.text())
    const importedProfiles = Object.fromEntries(
      Object.entries(content).filter(([key]) => key.startsWith('+')),
    ) as any
    setProfiles(importedProfiles)

    if (content[settingsStoreKey]) {
      await storageSettings.set(content[settingsStoreKey])
    }

    await storageCurrentProfileName.set('[direct]')
    await saveToLocal()
  }

  const handleExport = async () => {
    const settings = await storageSettings.get()
    downloadFile(
      JSON.stringify({ ...profiles, [settingsStoreKey]: settings }),
      `${projectName}.bak`,
    )
  }

  return (
    <>
      <div>
        <div className='py-6'>
          <h2 className='text-2xl font-medium'>导入/导出</h2>
        </div>

        <div className='border-b'></div>
      </div>

      <main className='flex gap-x-2 pt-2'>
        <Button size='sm' variant='bordered' onClick={handleImport}>
          导入
        </Button>

        <Button size='sm' onClick={handleExport}>
          导出
        </Button>
      </main>
    </>
  )
}
