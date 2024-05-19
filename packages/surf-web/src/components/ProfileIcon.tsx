import type { ProfileType } from "surf-pac";
import { getIconByProfileType } from "~/lib";

const ProfileIcon = ({ profileType }: { profileType: ProfileType }) => {
  const Icon = getIconByProfileType(profileType)!;
  return <Icon />;
};

export { ProfileIcon };
