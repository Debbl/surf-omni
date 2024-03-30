import { preprocess } from "surf-pac";
import { useMemo } from "react";
import { Button } from "~/components/Button";
import { useProfile } from "~/entrypoints/index/hooks/useProfile";
import { Input } from "~/components/Input";
import { Textarea } from "~/components/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/Select";
import { useProfiles } from "@/atoms/hooks/useProfiles";
import type {
  SwitchProfile as ISwitchProfile,
  RuleListProfile,
} from "surf-pac";

const handleUpdateSource = async (
  url: string,
  updateRaw: (raw: string) => void,
) => {
  const response = await fetch(url);
  const raw = await response.text();

  updateRaw(preprocess(raw));
};

export default function SwitchProfile({
  profileName,
}: {
  profileName: string;
}) {
  const { profile: switchProfile } = useProfile<ISwitchProfile>(profileName);
  const { profile: ruleListProfile, setProfile: setRuleListProfile } =
    useProfile<RuleListProfile>(switchProfile.defaultProfileName);
  const { showProfiles } = useProfiles();

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

  return (
    <div>
      <div className="flex items-center justify-between py-6">
        <div className="text-2xl font-medium">
          情景模式：{switchProfile.name}
        </div>
      </div>
      <div className="border-b" />

      <div className="pt-4">
        <div>
          <div className="text-2xl">切换规则</div>
          <div className="mt-6 flex w-full items-center gap-x-2 text-sm">
            <div>规则列表网址</div>
            <div>
              <Input
                value={ruleListProfile.url}
                className="w-[30rem]"
                type="text"
                onChange={(e) => {
                  setRuleListProfile({
                    ...ruleListProfile,
                    url: e.target.value,
                  });
                }}
              />
            </div>
            <Button
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
          <div>规则列表规则</div>
          <Select
            value={ruleListProfile.matchProfileName}
            onValueChange={(value) => {
              setRuleListProfile({
                ...ruleListProfile,
                matchProfileName: value as any,
              });
            }}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="select" />
            </SelectTrigger>
            <SelectContent>
              {matchProfileNames.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="mb-2 mt-6 text-2xl">规则列表设置</div>
        </div>

        <div>
          <div className="mb-2 mt-6 text-2xl">规则列表正文</div>
          <Textarea
            value={ruleListProfile.raw}
            rows={8}
            className="w-[80%]"
            onChange={(e) => {
              setRuleListProfile({
                ...ruleListProfile,
                raw: e.target.value,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
