import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { nameAsKey } from "surf-pac";
import { Flex } from "antd";
import stylex from "@stylexjs/stylex";
import { useProfiles } from "@/atoms/hooks/useProfiles";
import { globalStyles } from "@/styles";

const styles = stylex.create({
  header: {
    height: 80,
    padding: "20px 0",
  },
  title: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
});

export default function ProfileName() {
  const { profileName = "" } = useParams();
  const { profiles } = useProfiles();

  const currentProfile = useMemo(
    () => profiles[nameAsKey(profileName)],
    [profiles, profileName],
  );
  // console.log(currentProfile);

  return (
    <Flex vertical {...stylex.props(globalStyles["size-full"])}>
      <Flex align="center" {...stylex.props(styles.header)}>
        <Flex align="center">
          <div>情景模式：</div>
          <div>{currentProfile.name}</div>
        </Flex>
      </Flex>
      <div {...stylex.props(styles.content)}>content</div>
    </Flex>
  );
}
