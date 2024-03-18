import { Fragment } from "react";
import { getProxyValue } from "surf-pac";
import { setBrowserProxy } from "@/lib/proxy";
import { useLoadFormLocal } from "~/atoms/hooks/useLoadFormLocal";
import { Button } from "~/components/Button";
import { Earth, Settings, TransferFill } from "~/icons";
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

  if (isLoading) return <div>loading</div>;

  return (
    <>
      <ul>
        {Menu.map((item) => (
          <Fragment key={item.name}>
            <li className="border-b"></li>
            {item.children.map((i) => (
              <li key={i.name}>
                <Button
                  leftIcon={i.icon}
                  onClick={() => {
                    if (i.onClick) {
                      i.onClick();
                    } else {
                      setBrowserProxy({
                        value: getProxyValue(i.profileName ?? ""),
                      });
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
