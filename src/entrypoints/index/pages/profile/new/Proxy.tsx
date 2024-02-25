import { useState } from "react";
import { SCHEMA } from "@/constansts";
import { useGlobalStore } from "@/store";
import type { IScheme } from "@/types";
import type { IProfile, IProfileMap } from "@/store";

export default function Proxy() {
  const { handleAddProfile } = useGlobalStore((state) => ({
    handleAddProfile: (profile: IProfile) => {
      if (!profile.name) return;

      const isExit = !!state.profiles.find((p) => p.name === profile.name);
      if (isExit) return;

      state.addProfile(profile);
    },
  }));

  const [profile, setProfile] = useState<IProfileMap["fixed_servers"]>({
    name: "",
    value: {
      mode: "fixed_servers",
      rules: {
        fallbackProxy: {
          scheme: "http",
          host: "example.com",
          port: 80,
        },
      },
    },
  });

  const { name } = profile;
  const { scheme, host, port } = profile.value.rules.fallbackProxy;

  function setFallbackProxy(
    fallbackProxy: Partial<
      IProfileMap["fixed_servers"]["value"]["rules"]["fallbackProxy"]
    >,
  ) {
    setProfile({
      ...profile,
      value: {
        mode: profile.value.mode,
        rules: {
          fallbackProxy: {
            ...profile.value.rules.fallbackProxy,
            ...fallbackProxy,
          },
        },
      },
    });
  }

  return (
    <div>
      <div className="mt-4 flex justify-between px-2">
        <h3 className="text-xl font-bold">代理服务器</h3>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => handleAddProfile(profile)}
        >
          保存
        </button>
      </div>

      <div className="flex items-center py-4 pl-8">
        <label className="flex items-center gap-x-2">
          <span>名称</span>
          <input
            type="text"
            placeholder="请输入情景模式名称"
            value={name}
            onChange={(e) =>
              setProfile({
                ...profile,
                name: e.target.value,
              })
            }
            className="input input-sm input-bordered max-w-xs"
          />
        </label>
      </div>

      <div className="overflow-x-auto px-8 pt-2">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>代理协议</th>
              <th>代理服务器</th>
              <th>代理端口</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <td>
                <select
                  value={scheme}
                  onChange={(e) => {
                    setFallbackProxy({ scheme: e.target.value as IScheme });
                  }}
                  className="select select-bordered select-sm w-full max-w-xs"
                >
                  {SCHEMA.map((schema) => (
                    <option key={schema}>{schema}</option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  value={host}
                  onChange={(e) => {
                    setFallbackProxy({
                      host: e.target.value,
                    });
                  }}
                  type="text"
                  className="input input-sm input-bordered w-full max-w-xs"
                />
              </td>
              <td>
                <input
                  value={port}
                  onChange={(e) => {
                    setFallbackProxy({
                      port: Number(e.target.value),
                    });
                  }}
                  type="number"
                  className="input input-sm input-bordered w-full max-w-xs"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
