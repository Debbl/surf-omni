import { useGlobalStore } from "@/store";
import { CiSettings, Icon } from "@/icons";
import { getIconByMode } from "@/utils";
import type { IProfiles } from "@/store";

const BasicProfiles: IProfiles = [
  {
    name: "[直接连接]",
    value: {
      mode: "direct",
    },
  },
  {
    name: "[系统代理]",
    value: {
      mode: "system",
    },
  },
];

async function handleOpenSetting() {
  const url = `chrome-extension://${browser.runtime.id}/index.html`;
  const tabs = await browser.tabs.query({ url });

  if (tabs.length !== 0) {
    await browser.tabs.update(tabs[0].id, { active: true });
  } else {
    browser.tabs.create({
      url,
    });
  }
}

function App() {
  const { currentProfileName, profiles, changeProfile } = useGlobalStore(
    (state) => ({
      changeProfile: state.changeProfile,
      currentProfileName: state.currentProfileName,
      profiles: state.profiles,
    }),
  );

  function handleClick(name: string) {
    const profile = [...BasicProfiles, ...profiles].find(
      (p) => p.name === name,
    );

    profile && changeProfile(profile);
    window.close();
  }

  return (
    <div>
      <ul className="flex w-44 flex-col items-center p-1 text-sm">
        {BasicProfiles.map(({ name, value: { mode } }) => (
          <li
            className={`w-full px-2 py-1.5 ${name === currentProfileName ? "bg-blue-100" : "hover:bg-gray-100"}`}
            key={name}
          >
            <button
              className="flex items-center gap-x-2"
              onClick={() => handleClick(name)}
            >
              <Icon icon={getIconByMode(mode)} />
              <span className="text-sm text-[#4678B2]">{name}</span>
            </button>
          </li>
        ))}

        {profiles.length ? (
          <div className="my-1 w-full border-t border-solid border-gray-300"></div>
        ) : null}

        {profiles.map(({ name, value: { mode } }) => (
          <li
            className={`w-full px-2 py-1.5 ${name === currentProfileName ? "bg-blue-100" : "hover:bg-gray-100"}`}
            key={name}
          >
            <button
              className="flex items-center gap-x-2"
              onClick={() => handleClick(name)}
            >
              <Icon icon={getIconByMode(mode)} />
              <span className="text-sm text-[#4678B2]">{name}</span>
            </button>
          </li>
        ))}

        <div className="my-1 w-full border-t border-solid border-gray-300"></div>

        <li className="w-full px-2 py-1.5 hover:bg-gray-100">
          <button
            className="flex items-center gap-x-2"
            onClick={() => handleOpenSetting()}
          >
            <Icon icon={CiSettings} />
            <span className="text-sm text-[#4678B2]">选项</span>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default App;
