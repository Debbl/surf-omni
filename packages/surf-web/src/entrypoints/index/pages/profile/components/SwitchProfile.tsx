import { getProxyValue, preprocess } from "surf-pac";
import { useMemo } from "react";
import type {
  SwitchProfile as ISwitchProfile,
  RuleListProfile,
} from "surf-pac";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { SwitchProfileRules } from "./SwitchProfileRules";
import { useProfile } from "~/entrypoints/index/hooks/useProfile";
import { useProfiles } from "~/atoms/hooks/useProfiles";
import { Download, Icon } from "~/icons";
import { downloadFile } from "@/lib";

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
  const { profile: switchProfile, setProfile: setSwitchProfile } =
    useProfile<ISwitchProfile>(profileName);

  const { profile: ruleListProfile, setProfile: setRuleListProfile } =
    useProfile<RuleListProfile>(switchProfile.defaultProfileName);
  const { showProfiles, profiles } = useProfiles();

  const matchProfileNames = useMemo(() => {
    return [
      ...Object.values(showProfiles)
        .map((profile) => ({
          label: profile.name,
          value: profile.name,
        }))
        .filter(({ value }) => value !== switchProfile.name),
      {
        label: "直接连接",
        value: "direct",
      },
    ];
  }, [showProfiles, switchProfile.name]);

  const exportPacScript = () => {
    const script = getProxyValue(switchProfile.name, profiles);
    const data = script.pacScript?.data || "";

    downloadFile(data, `${switchProfile.name}.pac`);
  };

  return (
    <div className="h-full overflow-y-scroll pb-20">
      <div className="flex items-center justify-between py-6">
        <div className="text-2xl font-medium">
          情景模式：{switchProfile.name}
        </div>
        <div className="px-6">
          <Button
            size="sm"
            startContent={<Icon icon={Download} />}
            onClick={() => exportPacScript()}
          >
            导出PAC
          </Button>
        </div>
      </div>
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
