import React, { useState } from "react";
import { Layout, Menu } from "antd";
import * as stylex from "@stylexjs/stylex";
import { Link, Outlet } from "react-router-dom";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  SettingOutlined,
  ToolFilled,
} from "@ant-design/icons";
import NewProfile from "../components/NewProfile";
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
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps["items"] = [
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
    [getItem("新建情景模式", "new-profile", <PlusOutlined />)],
    "group",
  ),
  { type: "divider" },
  getItem(
    "Actions",
    "actions",
    null,
    [
      getItem("应用选项", "apply", <CheckCircleOutlined />),
      getItem("撤销更改", "undo", <CloseCircleOutlined />),
    ],
    "group",
  ),
];

const styles = stylex.create({
  layout: {
    height: "100%",
  },
  sider: {
    color: "#0958d9",
  },
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
});

export default function App() {
  const [isSetNewProfile, setIsSetNewProfile] = useState(false);
  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key === "new-profile") setIsSetNewProfile(true);
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
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Content {...stylex.props(styles.content)}>
          <Outlet />
        </Content>
      </Layout>
    </>
  );
}
