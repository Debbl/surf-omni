import React, { useMemo, useState } from "react";
import { Layout, Menu, Space } from "antd";
import * as stylex from "@stylexjs/stylex";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  SettingOutlined,
  ToolFilled,
} from "@ant-design/icons";
import { useAtom } from "jotai";
import { isProfile, keyAsName, nameAsKey } from "surf-pac";
import { useStore } from "@/atoms/hooks/useStore";
import { isSettingsChangeAtom } from "@/atoms/isSettingsChange";
import { useProfiles } from "@/atoms/hooks/useProfiles";
import NewProfile from "../../../components/NewProfile";
import type { MenuProps } from "antd";

const { Sider, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
): MenuItem {
  return {
    label,
    key,
    icon,
    children,
    type,
  } as MenuItem;
}

const styles = stylex.create({
  layout: {
    height: "100%",
  },
  sider: {},
  h1: {
    textAlign: "center",
  },
  header: {
    textAlign: "center",
    color: "#fff",
    height: 64,
    paddingInline: 48,
    lineHeight: "64px",
    backgroundColor: "#4096ff",
  },
  content: {
    textAlign: "center",
    minHeight: 120,
    lineHeight: "120px",
    color: "#fff",
    backgroundColor: "#0958d9",
  },

  // save action
  save: {
    color: "#52c41a",
  },
  undo: {
    color: "#ff4d4f",
  },
});

export default function App() {
  const { save } = useStore();
  const { profiles } = useProfiles();
  const [isSettingsChange] = useAtom(isSettingsChangeAtom);
  const [isSetNewProfile, setIsSetNewProfile] = useState(false);

  const navigate = useNavigate();

  const { profileName } = useParams();
  const selectedKeys = useMemo(
    () => [nameAsKey(profileName ?? "")],
    [profileName],
  );

  const menuItems: MenuProps["items"] = useMemo(
    () => [
      { type: "divider" },
      getItem(
        "设定",
        "settings",
        null,
        [
          getItem("界面", "14", <ToolFilled />),
          getItem("通用", "13", <SettingOutlined />),
          getItem("导入/导出", "15", <SaveOutlined />),
        ],
        "group",
      ),
      { type: "divider" },
      getItem(
        "情景模式",
        "profiles",
        null,
        [
          ...[
            ...Object.entries(profiles).map(([key, { name }]) =>
              getItem(name, key),
            ),
          ],
          getItem("新建情景模式", "new-profile", <PlusOutlined />),
        ],
        "group",
      ),
      { type: "divider" },
      getItem(
        "Actions",
        "actions",
        null,
        [
          getItem(
            <Space size={10} {...stylex.props(isSettingsChange && styles.save)}>
              <CheckCircleOutlined />
              应用选项
            </Space>,
            "save",
          ),
          getItem(
            <Space size={10} {...stylex.props(isSettingsChange && styles.undo)}>
              <CloseCircleOutlined />
              撤销更改
            </Space>,
            "undo",
          ),
        ],
        "group",
      ),
    ],
    [isSettingsChange, profiles],
  );

  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key === "new-profile") setIsSetNewProfile(true);

    if (e.key === "save") save();

    if (isProfile(e.key)) {
      navigate(`/profile/${keyAsName(e.key)}`);
    }
  };

  return (
    <>
      <NewProfile isOpen={isSetNewProfile} setIsOpen={setIsSetNewProfile} />
      <Layout {...stylex.props(styles.layout)}>
        <Sider {...stylex.props(styles.sider)} theme="light">
          <h1 {...stylex.props(styles.h1)}>
            <Link to="/">Surf Omni</Link>
          </h1>

          <Menu
            onClick={onClick}
            selectable={false}
            selectedKeys={selectedKeys}
            mode="inline"
            items={menuItems}
          />
        </Sider>
        <Content {...stylex.props(styles.content)}>
          <Outlet />
        </Content>
      </Layout>
    </>
  );
}
