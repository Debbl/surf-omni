import { Input } from "~/components/Input";
import { Textarea } from "~/components/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/Select";
import type { FixedProfile as IFixedProfile } from "surf-pac";

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
  return (
    <div>
      <div className="flex items-center justify-between py-6">
        <div className="text-2xl font-medium">情景模式：{profile.name}</div>
      </div>
      <div className="border-b"></div>

      <div className="pt-4">
        <div className="text-2xl">代理服务器</div>

        <table className="mt-2 w-[80%] border-separate border-spacing-2 rounded-sm border text-left text-sm">
          <thead>
            <tr>
              <th>代理协议</th>
              <th>代理服务器</th>
              <th>代理端口</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Select
                  value={profile.singleProxy.scheme}
                  onValueChange={(value) => {
                    setProfile({
                      ...profile,
                      singleProxy: {
                        ...profile.singleProxy,
                        scheme: value as any,
                      },
                    });
                  }}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Select a timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHEME.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td>
                <Input
                  type="text"
                  value={profile.singleProxy.host}
                  onChange={(e) => {
                    setProfile({
                      ...profile,
                      singleProxy: {
                        ...profile.singleProxy,
                        host: e.target.value,
                      },
                    });
                  }}
                />
              </td>
              <td>
                <Input
                  type="number"
                  value={profile.singleProxy.port}
                  onChange={(e) => {
                    setProfile({
                      ...profile,
                      singleProxy: {
                        ...profile.singleProxy,
                        port: Number.parseInt(e.target.value),
                      },
                    });
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mb-2 mt-6 text-2xl">不代理的主机列表</div>
        <Textarea
          value={profile.bypassList.map((item) => item.pattern).join("\n")}
          onChange={(e) => {
            setProfile({
              ...profile,
              bypassList: e.target.value.split("\n").map((pattern) => ({
                conditionType: "BypassCondition",
                pattern,
              })),
            });
          }}
          rows={8}
          className="w-[80%]"
        />
      </div>
    </div>
  );
}
