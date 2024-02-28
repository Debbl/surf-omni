import { NavLink, Outlet } from "react-router-dom";
import {
  Icon,
  IonEarth,
  MaterialSymbolsAutorenewOutlineRounded,
} from "@/icons";

const tags = [
  {
    name: "代理服务器",
    path: "proxy",
    icon: IonEarth,
  },
  {
    name: "自动切换模式",
    path: "auto-switch",
    icon: MaterialSymbolsAutorenewOutlineRounded,
  },
];

export default function New() {
  return (
    <div className="flex h-full flex-col items-center">
      <div className="w-full">
        <h2 className="flex items-center py-4 pl-2 text-2xl font-bold">
          <span>情景模式</span>
        </h2>
      </div>

      <nav className="w-full p-2">
        <div role="tablist" className="tabs tabs-lifted">
          {tags.map(({ name, path, icon }) => (
            <NavLink
              key={name}
              to={`${path}`}
              role="tab"
              className={({ isActive }) =>
                `tab ${isActive ? "tab-active" : ""}`
              }
              caseSensitive
            >
              <Icon icon={icon} />
              {name}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="w-full flex-1">
        <Outlet />
      </div>
    </div>
  );
}
