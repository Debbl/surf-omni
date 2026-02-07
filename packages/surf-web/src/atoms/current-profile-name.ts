import { atom } from 'jotai'
import { storageCurrentProfileName, store } from '~/lib'

export const currentProfileNameStoreKey = 'currentProfileName'
export const currentProfileNameAtom = atom<string>('[system]')

currentProfileNameAtom.onMount = () => {
  store.sub(currentProfileNameAtom, async () => {
    const currentProfileName = store.get(currentProfileNameAtom)

    await storageCurrentProfileName.set(currentProfileName)
  })
}
