import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { nameAsKey } from "surf-pac";
import { useProfiles } from "@/atoms/hooks/useProfiles";

export default function ProfileName() {
  const { profileName = "" } = useParams();
  const { profiles } = useProfiles();

  const currentProfile = useMemo(
    () => profiles[nameAsKey(profileName)],
    [profiles, profileName],
  );
  // console.log(currentProfile);

  return <div>{JSON.stringify(currentProfile)}</div>;
}
