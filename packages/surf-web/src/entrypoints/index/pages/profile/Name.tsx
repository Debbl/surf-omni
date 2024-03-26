import { useParams } from "react-router-dom";
import { useProfile } from "~/entrypoints/index/hooks/useProfile";
import FixedProfile from "./components/FixedProfile";

export default function ProfileName() {
  const { name = "" } = useParams();
  const { profile, setProfile } = useProfile(name);

  if (!profile) return <div>Profile not found</div>;

  if (profile.profileType === "FixedProfile") {
    <FixedProfile profile={profile} setProfile={setProfile} />;
  }

  return <div>name</div>;
}
