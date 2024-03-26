import { useParams } from "react-router-dom";
import { useProfile } from "~/entrypoints/index/hooks/useProfile";

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

export default function ProfileName() {
  const { name = "" } = useParams();
  const { profile, setProfile } = useProfile(name);

  if (!profile) return <div>Profile not found</div>;

  if (profile.profileType === "FixedProfile") {
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
                  <select
                    value={profile.singleProxy.scheme}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        singleProxy: {
                          ...profile.singleProxy,
                          scheme: e.target.value as any,
                        },
                      })
                    }
                  >
                    {SCHEME.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    className="rounded-sm border"
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
                  <input
                    type="text"
                    className="rounded-sm border"
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
          <textarea
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
            className="w-[80%] rounded-sm border p-2"
          />
        </div>
      </div>
    );
  }

  return <div>name</div>;
}
