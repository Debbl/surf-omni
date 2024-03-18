import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { nameAsKey } from "surf-pac";
import { useProfiles } from "~/atoms/hooks/useProfiles";

export default function ProfileName() {
  const { name } = useParams();
  const { profiles } = useProfiles();

  const currentProfile = useMemo(() => {
    if (!name) return "";
    return profiles[nameAsKey(name)];
  }, [name, profiles]);

  if (!currentProfile) return <div>Profile not found</div>;

  return (
    <div>
      <div className="py-6 text-2xl font-medium">
        情景模式：{currentProfile.name}
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
                <select defaultValue="http">
                  <option value="http">HTTP</option>
                </select>
              </td>
              <td>
                <input type="text" className="rounded-sm border" />
              </td>
              <td>
                <input type="text" className="rounded-sm border" />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mb-2 mt-6 text-2xl">不代理的主机列表</div>
        <textarea rows={8} className="w-[80%] rounded-sm border p-2"></textarea>
      </div>
    </div>
  );
}
