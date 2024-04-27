import { useParams } from "react-router-dom";
import FixedProfile from "./components/FixedProfile";
import SwitchProfile from "./components/SwitchProfile";
import { useProfile } from "~/entrypoints/index/hooks/useProfile";

export default function ProfileName() {
  const { name = "" } = useParams();
  const { profile, setProfile } = useProfile(name);

  if (!profile) return <div>Profile not found</div>;

  if (profile.profileType === "FixedProfile") {
    return <FixedProfile profile={profile} setProfile={setProfile} />;
  }

  if (profile.profileType === "SwitchProfile") {
    return <SwitchProfile profileName={name} />;
  }

  return <div>name</div>;
}
