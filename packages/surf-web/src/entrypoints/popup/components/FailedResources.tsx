import {
  Button,
  Checkbox,
  CheckboxGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useState } from "react";
import type { SwitchProfile } from "surf-pac";
import { useSwitchProfile } from "@/atoms/hooks/useSwitchProfile";
import { saveToLocal } from "@/lib";

export default function FailedResources({
  name,
  failedResources,
  setIsShowFailedResources,
}: {
  name: string;
  failedResources: string[];
  setIsShowFailedResources: (setIsShowFailedResources: boolean) => void;
}) {
  const { switchProfile, setSwitchProfile, matchProfileNames } =
    useSwitchProfile<SwitchProfile>(name);

  const patternFailedResources = failedResources.map((r) => `*.${r}`);
  const [conditions, setConditions] = useState<string[]>(
    patternFailedResources,
  );
  const [profileName, setProfileName] = useState("");

  const handleAddConditions = () => {
    if (!profileName) return;

    setSwitchProfile({
      ...switchProfile,
      rules: [
        ...switchProfile.rules,
        ...conditions.map((c) => ({
          condition: {
            conditionType: "HostWildcardCondition" as const,
            pattern: c,
          },
          profileName,
        })),
      ],
    });
    saveToLocal();
    setIsShowFailedResources(false);
    browser.tabs.reload();
  };

  return (
    <div className="flex min-w-72 flex-col gap-y-4 px-2">
      <div className="flex items-center gap-x-2 p-2 text-lg">
        <div>添加条件到情景模式</div>
      </div>

      <CheckboxGroup
        aria-label="选择网址"
        value={conditions}
        onChange={setConditions}
      >
        {patternFailedResources.map((r) => (
          <Checkbox key={r} value={r}>
            {r}
          </Checkbox>
        ))}
      </CheckboxGroup>

      <Select
        size="sm"
        label="选择情景模式"
        selectedKeys={[profileName]}
        onChange={(e) => setProfileName(e.target.value)}
      >
        {matchProfileNames.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </Select>

      <div className="flex items-center justify-between py-4">
        <Button onClick={() => setIsShowFailedResources(false)}>取消</Button>
        <Button color="primary" onClick={() => handleAddConditions()}>
          确定
        </Button>
      </div>
    </div>
  );
}