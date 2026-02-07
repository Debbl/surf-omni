import { atom } from 'jotai'
import { storageFailedResources, store } from '~/lib'

export const failedResourcesKey = 'failedResources'
export const failedResourcesAtom = atom<string[]>([])

failedResourcesAtom.onMount = () => {
  store.sub(failedResourcesAtom, async () => {
    const failedResources = store.get(failedResourcesAtom)

    await storageFailedResources.set(failedResources)
  })
}
