import { Menu, Spin } from "antd";
import { useMemo } from "react";
import { SettingOutlined } from "@ant-design/icons";
import { joinArr } from "@debbl/utils";
import { useLoadFormLocal } from "~/atoms/hooks/useLoadFormLocal";
import { useProfiles } from "@/atoms/hooks/useProfiles";
import type { MenuProps } from "antd";

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

type MenuItem = Required<MenuProps>["items"][number];

const builtinItems = [
  {
    label: "直接连接",
    key: "direct",
  },
  {
    label: "系统代理",
    key: "system",
  },
];

const settingItem = [
  {
    icon: <SettingOutlined />,
    label: "选项",
    key: "setting",
  },
];

function App() {
  const { isLoading } = useLoadFormLocal();
  const { profiles } = useProfiles();

  const items: MenuItem[] = useMemo(() => {
    const profilesItems = Object.entries(profiles).map(([key, profile]) => ({
      label: profile.name,
      key,
    }));

    return joinArr(
      [builtinItems, profilesItems, settingItem].filter((i) => i.length),
      {
        type: "divider",
      },
    );
  }, [profiles]);

  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key === "setting") {
      handleOpenSetting();
    }

    window.close();
  };

  if (isLoading) return <Spin fullscreen />;

  return (
    <Menu
      selectable={false}
      onClick={onClick}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      items={items}
    />
  );
}

export default App;
