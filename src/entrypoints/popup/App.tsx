import { useGlobalStore } from "@/store";
import {
  CiSettings,
  Icon,
  IonEarth,
  MingcuteTransferFill,
  TdesignPoweroff,
} from "@/icons";
import type { IMode } from "@/store";
import type { IIcon } from "@/icons";

interface IOption {
  icon: IIcon;
  name: string;
  mode: IMode;
}

const BasicOptions: IOption[] = [
  {
    icon: MingcuteTransferFill,
    name: "[直接连接]",
    mode: "direct",
  },
  {
    icon: TdesignPoweroff,
    name: "[系统代理]",
    mode: "system",
  },
];

const OtherOptions: IOption[] = [
  {
    icon: IonEarth,
    name: "fixed_servers",
    mode: "fixed_servers",
  },
  {
    icon: IonEarth,
    name: "pac_script",
    mode: "pac_script",
  },
  {
    icon: IonEarth,
    name: "auto_detect",
    mode: "auto_detect",
  },
];

function App() {
  const { currentProxy, setMode } = useGlobalStore((state) => ({
    currentProxy: state.currentProxy,
    setMode: state.setMode,
  }));

  const currentMode = currentProxy.value.mode;

  function handleClick(mode: IMode) {
    setMode(mode);
    window.close();
  }

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

  return (
    <div>
      <ul className="w-44 text-sm p-1 flex flex-col items-center">
        {BasicOptions.map(({ name, mode, icon }) => (
          <li
            className={`w-full px-2 py-1.5 ${mode === currentMode ? "bg-blue-100" : "hover:bg-gray-100"}`}
            key={name}
          >
            <button
              className="flex items-center gap-x-2"
              onClick={() => handleClick(mode)}
            >
              <Icon icon={icon} />
              <span className="text-sm text-[#4678B2]">{name}</span>
            </button>
          </li>
        ))}

        <div className="w-full border-t border-gray-300 my-1 border-solid"></div>

        {OtherOptions.map(({ name, mode, icon }) => (
          <li
            className={`w-full px-2 py-1.5 ${mode === currentMode ? "bg-blue-100" : "hover:bg-gray-100"}`}
            key={name}
          >
            <button
              className="flex items-center gap-x-2"
              onClick={() => handleClick(mode)}
            >
              <Icon icon={icon} />
              <span className="text-sm text-[#4678B2]">{name}</span>
            </button>
          </li>
        ))}

        <div className="w-full border-t border-gray-300 my-1 border-solid"></div>

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
