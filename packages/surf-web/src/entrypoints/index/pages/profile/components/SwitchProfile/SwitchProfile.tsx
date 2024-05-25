import { preprocess } from "surf-pac";
import { useCallback, useMemo } from "react";
import type {
  SwitchProfile as ISwitchProfile,
  RuleListProfile,
} from "surf-pac";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import ProfileTop from "../ProfileTop";
import { SwitchProfileRules } from "./SwitchProfileRules";
import { useProfiles } from "~/atoms/hooks/useProfiles";
import { useProfile } from "~/atoms/hooks/useProfile";
import { useSwitchProfile } from "~/atoms/hooks/useSwitchProfile";

const handleUpdateSource = async (
  url: string,
  updateRaw: (raw: string) => void,
) => {
  const response = await fetch(url);
  const raw = await response.text();

  updateRaw(preprocess(raw) ?? "");
};

export default function SwitchProfile({
  profileName,
}: {
  profileName: string;
}) {
  const { switchProfile, setSwitchProfile, matchProfileNames } =
    useSwitchProfile<ISwitchProfile>(profileName);

  const { profile: ruleListProfile, setProfile: setRuleListProfile } =
    useProfile<RuleListProfile>(switchProfile.defaultProfileName);
  const { profiles } = useProfiles();

  const color = useMemo(() => switchProfile.color, [switchProfile]);
  const setColor = useCallback(
    (v: string) => setSwitchProfile({ ...switchProfile, color: v }),
    [switchProfile, setSwitchProfile],
  );

  return (
    <div className="h-full overflow-y-scroll pb-20">
      <ProfileTop
        color={color}
        setColor={setColor}
        name={switchProfile.name}
        profiles={profiles}
      />
      <div className="border-b" />

      <div className="pt-4">
        <div>
          <SwitchProfileRules
            matchProfileNames={matchProfileNames}
            switchProfile={switchProfile}
            setSwitchProfile={setSwitchProfile}
          />
        </div>

        <div>
          <div className="mb-2 mt-6 text-2xl">规则列表设置</div>
          <div className="mt-6 flex w-full items-center gap-x-2 text-sm">
            <div>
              <Input
                size="sm"
                label="规则列表网址"
                value={ruleListProfile.url}
                className="w-[30rem]"
                onValueChange={(v) => {
                  setRuleListProfile({
                    ...ruleListProfile,
                    url: v,
                  });
                }}
              />
            </div>
            <Button
              variant="solid"
              color="primary"
              onClick={() => {
                handleUpdateSource(ruleListProfile.url, (raw) => {
                  setRuleListProfile({
                    ...ruleListProfile,
                    raw,
                  });
                });
              }}
              className="w-20 justify-center"
            >
              更新
            </Button>
          </div>
          <Select
            size="sm"
            className="mt-4 w-60"
            label="选择规则列表规则"
            selectedKeys={[ruleListProfile.matchProfileName]}
            onChange={(e) => {
              setRuleListProfile({
                ...ruleListProfile,
                matchProfileName: e.target.value,
              });
            }}
          >
            {matchProfileNames.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="mt-8">
          <Textarea
            label="规则列表正文"
            value={ruleListProfile.raw}
            minRows={8}
            disabled
            className="w-4/5"
            onValueChange={(v) => {
              setRuleListProfile({
                ...ruleListProfile,
                raw: v,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
