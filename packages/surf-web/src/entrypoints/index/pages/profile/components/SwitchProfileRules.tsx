import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/Select";
import { TableCell, TableRow } from "~/components/Table";
import { Delete, Icon, Plus } from "~/icons";
import type { ConditionType, SwitchProfile } from "surf-pac";

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
    <>
      {switchProfile.rules.map((rule, index) => (
        <TableRow key={index}>
          <TableCell>
            <Select
              value={rule.condition.conditionType}
              onValueChange={(value) =>
                setConditionType(index, value as ConditionType)
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="select" />
              </SelectTrigger>
              <SelectContent>
                {conditionType.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            <Input
              type="text"
              value={rule.condition.pattern}
              onChange={(e) => setConditionPattern(index, e.target.value)}
            />
          </TableCell>
          <TableCell>
            <Select
              value={rule.profileName}
              onValueChange={(value) => setProfileName(index, value)}
            >
              <SelectTrigger className="w-36">
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
          </TableCell>
          <TableCell>
            <Button
              onClick={() => handleRemoveRule(index)}
              className="justify-center"
            >
              <Icon icon={Delete} />
            </Button>
          </TableCell>
        </TableRow>
      ))}
      <TableRow>
        <TableCell colSpan={4}>
          <Button onClick={() => handleAddRule()} className="w-36">
            <Icon icon={Plus} />
            添加规则
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}
