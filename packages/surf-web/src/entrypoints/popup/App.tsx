import { Fragment } from "react";
import { getProxyValue, nameAsKey } from "surf-pac";
import { setBrowserProxy } from "~/lib/proxy";
import { useLoadFormLocal } from "~/atoms/hooks/useLoadFormLocal";
import { Button } from "~/components/Button";
import { Earth, Settings, TransferFill } from "~/icons";
import { useProfiles } from "~/atoms/hooks/useProfiles";
import type { Profiles } from "surf-pac";
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

export const builtinProfiles: Profiles = {
  "+direct": {
    name: "direct",
    profileType: "DirectProfile",
  },
  "+system": {
    name: "system",
    profileType: "SystemProfile",
  },
};

export default function App() {
  const { isLoading } = useLoadFormLocal();
  const { profiles } = useProfiles();
  const allProfiles: Profiles = {
    ...builtinProfiles,
    ...profiles,
  };

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

  const handleClick = (profileName: string) => {
    const profile = allProfiles[nameAsKey(profileName)];
    if (!profile) return;

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
