import { Fragment } from "react";
import { getProxyValue } from "surf-pac";
import { useAtom } from "jotai";
import { twMerge } from "~/lib/tw";
import { setBrowserProxy } from "~/lib/proxy";
import { useLoadFormLocal } from "~/atoms/hooks/useLoadFormLocal";
import { Button } from "~/components/Button";
import { Earth, Settings, TransferFill } from "~/icons";
import { useProfiles } from "~/atoms/hooks/useProfiles";
import { currentProfileKeyAtom } from "~/atoms/currentProfileKey";
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
  const { profiles, allProfiles } = useProfiles();
  const [currentProfileKey, setCurrentProfileKey] = useAtom(
    currentProfileKeyAtom,
  );

  const Menu: {
    name: string;
    children: {
      name: string;
      icon?: IIcon;
      profileKey?: string;
      onClick?: () => void;
    }[];
  }[] = [
    {
      name: "BuiltinProfiles",
      children: [
        {
          name: "直接连接",
          icon: TransferFill,
          profileKey: "+direct",
        },
        {
          name: "系统代理",
          icon: Earth,
          profileKey: "+system",
        },
      ],
    },
    {
      name: "Profiles",
      children: [
        ...Object.values(profiles).map(({ name }) => ({
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

  // useEffect(() => {
  //   (async () => {
  //     setInterval(async () => {
  //       const v = await browser.proxy.settings.get({});
  //       console.log("🚀 ~ v:", v);
  //     }, 1000);
  //   })();
  // }, []);

  const handleClick = (profileKey: string) => {
    const profile = allProfiles[profileKey];
    if (!profile) return;
    setCurrentProfileKey(profileKey);

    setBrowserProxy({
      value: getProxyValue(profile),
    });
  };

  if (isLoading) return <div>loading</div>;

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
                    i.profileKey === currentProfileKey
                      ? "rounded-sm bg-blue-400 text-white hover:bg-blue-500"
                      : "",
                  )}
                  onClick={() => {
                    if (i.onClick) {
                      i.onClick();
                    } else {
                      i.profileKey && handleClick(i.profileKey);
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
