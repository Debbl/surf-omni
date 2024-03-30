import { Fragment } from "react";
import { getProxyValue, nameAsKey } from "surf-pac";
import { useAtom } from "jotai";
import { twMerge } from "~/lib/tw";
import { setBrowserProxy } from "~/lib/proxy";
import { useLoadFormLocal } from "~/atoms/hooks/useLoadFormLocal";
import { Button } from "~/components/Button";
import { Earth, Settings, TransferFill } from "~/icons";
import { useProfiles } from "~/atoms/hooks/useProfiles";
import { currentProfileNameAtom } from "@/atoms/currentProfileName";
import { Loading } from "~/components/Loading";
import type { IIcon } from "~/icons";

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

export default function App() {
  const { isLoading } = useLoadFormLocal();
  const { showProfiles, profiles, allProfiles } = useProfiles();
  const [currentProfileName, setCurrentProfileName] = useAtom(
    currentProfileNameAtom,
  );

  const Menu: {
    name: string;
    children: {
      name: string;
      icon?: IIcon;
      profileName?: string;
      onClick?: () => void;
    }[];
  }[] = [
    {
      name: "BuiltinProfiles",
      children: [
        {
          name: "直接连接",
          icon: TransferFill,
          profileName: "direct",
        },
        {
          name: "系统代理",
          icon: Earth,
          profileName: "system",
        },
      ],
    },
    {
      name: "Profiles",
      children: [
        ...Object.values(showProfiles).map(({ name }) => ({
          name,
          profileName: name,
        })),
      ],
    },
    {
      name: "Actions",
      children: [
        {
          name: "选项",
          icon: Settings,
          onClick: handleOpenSetting,
        },
      ],
    },
  ];

  const handleClick = (profileName: string) => {
    const profile = allProfiles[nameAsKey(profileName)];
    if (!profile) return;
    setCurrentProfileName(profileName);

    setBrowserProxy({
      value: getProxyValue(profileName, profiles),
    });
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <ul>
        {Menu.map((item) => (
          <Fragment key={item.name}>
            {item.children.length !== 0 && <li className="border-b" />}
            {item.children.map((i) => (
              <li key={i.name}>
                <Button
                  leftIcon={i.icon}
                  className={twMerge(
                    i.profileName === currentProfileName
                      ? "rounded-sm bg-blue-400 text-white hover:bg-blue-500"
                      : "",
                  )}
                  onClick={() => {
                    if (i.onClick) {
                      i.onClick();
                    } else {
                      i.profileName && handleClick(i.profileName);
                    }
                  }}
                >
                  {i.name}
                </Button>
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
    </>
  );
}
