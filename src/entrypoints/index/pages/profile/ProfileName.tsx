import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGlobalStore } from "@/store";

export default function ProfileName() {
  const { profileName } = useParams();
  const { allProfiles } = useGlobalStore((state) => ({
    allProfiles: [...state.basicProfiles, ...state.profiles],
  }));
  const profile = useMemo(
    () => allProfiles.find((p) => p.name === profileName),
    [allProfiles, profileName],
  );
  const mode = profile?.value.mode;

  // TODO: other mode
  if (mode !== "fixed_servers") return null;

  return <div>{mode}</div>;
}
