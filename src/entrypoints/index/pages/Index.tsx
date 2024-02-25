import { NavLink, Outlet } from "react-router-dom";
import { Icon, MdiPlus } from "@/icons";
import { useGlobalStore } from "@/store";
import { getIconByMode } from "@/utils";

export default function Index() {
  const { profiles } = useGlobalStore((state) => ({
    profiles: state.profiles,
  }));

  return (
    <div className="flex h-full">
      <aside className="border-r">
        <div className="navbar bg-base-100">
          <a className="btn btn-ghost text-xl">
            <h1>Surf Omni</h1>
          </a>
        </div>
        <ul className="menu w-56 rounded-box">
          <li>
            <h2 className="menu-title">情景模式</h2>
            <ul>
              {profiles.map(({ name, value }) => (
                <li key={name}>
                  <NavLink
                    to={`/profile/name/${name}`}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <Icon icon={getIconByMode(value.mode)} />
                    {name}
                  </NavLink>
                </li>
              ))}

              <li>
                <NavLink
                  to={"/profile/new"}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <Icon icon={MdiPlus} />
                  新建情景模式
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </aside>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
