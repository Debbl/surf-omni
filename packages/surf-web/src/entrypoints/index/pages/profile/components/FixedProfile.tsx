import {
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@nextui-org/react";
import { useCallback, useMemo } from "react";
import { useProfiles } from "~/atoms/hooks/useProfiles";
import ProfileTop from "./ProfileTop";
import type { FixedProfile as IFixedProfile, Scheme } from "surf-pac";

const SCHEME = [
  {
    label: "HTTP",
    value: "http",
  },
  {
    label: "HTTPS",
    value: "https",
  },
  {
    label: "SOCKS4",
    value: "socks4",
  },
  {
    label: "SOCKS5",
    value: "socks5",
  },
];

export default function FixedProfile({
  profile,
  setProfile,
}: {
  profile: IFixedProfile;
  setProfile: (profile: IFixedProfile) => void;
}) {
  const { profiles } = useProfiles();

  const color = useMemo(() => profile.color, [profile]);
  const setColor = useCallback(
    (v: string) => setProfile({ ...profile, color: v }),
    [profile, setProfile],
  );

  return (
    <div>
      <ProfileTop
        color={color}
        setColor={setColor}
        name={profile.name}
        profiles={profiles}
      />
      <div className="border-b"></div>

      <div className="pt-4">
        <div className="text-2xl">代理服务器</div>
        <div className="w-4/5 p-4">
          <Table aria-label="代理服务器">
            <TableHeader>
              <TableColumn width={160}>代理协议</TableColumn>
              <TableColumn>代理服务器</TableColumn>
              <TableColumn width={130}>代理端口</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Select
                    aria-label="选择代理协议"
                    selectedKeys={[profile.singleProxy.scheme]}
                    onChange={(e) => {
                      setProfile({
                        ...profile,
                        singleProxy: {
                          ...profile.singleProxy,
                          scheme: e.target.value as Scheme,
                        },
                      });
                    }}
                  >
                    {SCHEME.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    aria-label="host"
                    type="text"
                    value={profile.singleProxy.host}
                    onValueChange={(value) => {
                      setProfile({
                        ...profile,
                        singleProxy: {
                          ...profile.singleProxy,
                          host: value,
                        },
                      });
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    aria-label="port"
                    type="number"
                    value={`${profile.singleProxy.port}`}
                    onValueChange={(value) => {
                      setProfile({
                        ...profile,
                        singleProxy: {
                          ...profile.singleProxy,
                          port: Number.parseInt(value),
                        },
                      });
                    }}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="p-4">
          <Textarea
            label="不代理的主机列表"
            labelPlacement="outside"
            value={profile.bypassList.map((item) => item.pattern).join("\n")}
            onValueChange={(value) => {
              setProfile({
                ...profile,
                bypassList: value.split("\n").map((pattern) => ({
                  conditionType: "BypassCondition",
                  pattern,
                })),
              });
            }}
            minRows={8}
            className="w-4/5"
          />
        </div>
      </div>
    </div>
  );
}
