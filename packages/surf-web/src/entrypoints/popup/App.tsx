import { Fragment } from "react";
import { getProxyValue } from "surf-pac";
import { useAtom } from "jotai";
import { Button } from "@nextui-org/react";
import { useLoadFormLocal } from "~/atoms/hooks/useLoadFormLocal";
import { Icon, PowerOff, Settings, TransferFill } from "~/icons";
import { useProfiles } from "~/atoms/hooks/useProfiles";
import { Loading } from "~/components/Loading";
import { browserProxySettings, getIconByProfileType } from "~/lib";
import { currentProfileNameAtom } from "~/atoms/currentProfileName";
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
  const { showProfiles, allProfiles } = useProfiles();
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
          icon: PowerOff,
          profileName: "system",
        },
      ],
    },
    {
      name: "Profiles",
      children: [
        ...Object.values(showProfiles).map(({ name, profileType }) => ({
          name,
          icon: getIconByProfileType(profileType),
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
    setCurrentProfileName(profileName);

    browserProxySettings.set({
      value: getProxyValue(profileName, allProfiles),
    });
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <ul className="flex flex-col gap-y-1 py-1">
        {Menu.map((item, index) => (
          <Fragment key={item.name}>
            {item.children.length !== 0 && index !== 0 && (
              <li className="border-b" />
            )}
            {item.children.map((i) => (
              <li key={i.name}>
                <Button
                  className="w-full justify-start"
                  variant={
                    currentProfileName === i.profileName ? "solid" : "light"
                  }
                  color={
                    currentProfileName === i.profileName ? "primary" : "default"
                  }
                  onClick={() => {
                    if (i.onClick) {
                      i.onClick();
                    } else {
                      i.profileName && handleClick(i.profileName);
                    }
                  }}
                  startContent={
                    i.icon && <Icon className="size-4" icon={i.icon} />
                  }
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
