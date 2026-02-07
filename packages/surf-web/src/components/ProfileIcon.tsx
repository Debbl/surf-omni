import { getIconByProfileType } from '~/lib'
import type { ProfileType } from 'surf-pac'

const ProfileIcon = ({ profileType }: { profileType: ProfileType }) => {
  const Icon = getIconByProfileType(profileType)!
  return <Icon />
}

export { ProfileIcon }
