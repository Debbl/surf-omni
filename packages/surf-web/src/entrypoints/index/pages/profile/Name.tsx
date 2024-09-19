import { useParams } from "react-router-dom";
import { useProfile } from "~/atoms/hooks/useProfile";
import FixedProfile from "./components/FixedProfile";
import SwitchProfile from "./components/SwitchProfile";

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
