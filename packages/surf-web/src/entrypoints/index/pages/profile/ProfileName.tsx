import { useParams } from "react-router-dom";

export default function ProfileName() {
  const { profileName } = useParams();
  return <div>{profileName}</div>;
}
