import type { ConditionType, SwitchProfile } from "surf-pac";

import {
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useMemo } from "react";
import { Delete, Icon, Plus } from "~/icons";

const conditionType: {
  label: string;
  value: ConditionType;
}[] = [
  {
    label: "域名通配符",
    value: "HostWildcardCondition",
  },
  {
    label: "网址通配符",
    value: "UrlWildcardCondition",
  },
  {
    label: "网址正则",
    value: "UrlRegexCondition",
  },
  {
    label: "(禁用)",
    value: "FalseCondition",
  },
];
export function SwitchProfileRules({
  matchProfileNames,
  switchProfile,
  setSwitchProfile,
}: {
  matchProfileNames: { label: string; value: string }[];
  switchProfile: SwitchProfile;
  setSwitchProfile: (profile: SwitchProfile) => void;
}) {
  const items = useMemo(
    () =>
      switchProfile.rules.map((r, index) => ({
        ...r,
        index,
      })),
    [switchProfile],
  );

  const handleAddRule = () => {
    setSwitchProfile({
      ...switchProfile,
      rules: [
        ...switchProfile.rules,
        {
          condition: {
            conditionType: "HostWildcardCondition",
            pattern: "",
          },
          profileName: "direct",
        },
      ],
    });
  };

  const setConditionType = (index: number, value: ConditionType) => {
    const newRules = [...switchProfile.rules];
    newRules[index].condition.conditionType = value;

    setSwitchProfile({
      ...switchProfile,
      rules: newRules,
    });
  };

  const setConditionPattern = (index: number, value: string) => {
    const newRules = [...switchProfile.rules];
    newRules[index].condition.pattern = value;

    setSwitchProfile({
      ...switchProfile,
      rules: newRules,
    });
  };

  const setProfileName = (index: number, value: string) => {
    const newRules = [...switchProfile.rules];
    newRules[index].profileName = value;

    setSwitchProfile({
      ...switchProfile,
      rules: newRules,
    });
  };

  const handleRemoveRule = (index: number) => {
    const newRules = [...switchProfile.rules];
    newRules.splice(index, 1);

    setSwitchProfile({
      ...switchProfile,
      rules: newRules,
    });
  };

  return (
    <div>
      <div className="flex justify-between pr-4">
        <div className="font-mono text-2xl">切换规则</div>
        <Button size="sm" onClick={() => handleAddRule()}>
          <Icon icon={Plus} />
          添加规则
        </Button>
      </div>

      <Table
        aria-label="切换规则"
        removeWrapper
        isHeaderSticky
        classNames={{
          base: "mt-2 max-h-[320px] overflow-scroll px-4",
        }}
      >
        <TableHeader>
          <TableColumn width={180}>条件类型</TableColumn>
          <TableColumn>条件设置</TableColumn>
          <TableColumn width={180}>情景模式</TableColumn>
          <TableColumn width={80}>操作</TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(rule) => (
            <TableRow key={rule.index}>
              <TableCell>
                <Select
                  aria-label="选择条件类型"
                  selectedKeys={[rule.condition.conditionType]}
                  onChange={(e) =>
                    setConditionType(
                      rule.index,
                      e.target.value as ConditionType,
                    )
                  }
                >
                  {conditionType.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Input
                  aria-label="条件设置"
                  value={rule.condition.pattern}
                  onValueChange={(v) => setConditionPattern(rule.index, v)}
                />
              </TableCell>
              <TableCell>
                <Select
                  aria-label="选择情景模式"
                  selectedKeys={[rule.profileName]}
                  onChange={(e) => setProfileName(rule.index, e.target.value)}
                >
                  {matchProfileNames.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Button
                  isIconOnly
                  color="danger"
                  onClick={() => handleRemoveRule(rule.index)}
                >
                  <Icon icon={Delete} />
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
