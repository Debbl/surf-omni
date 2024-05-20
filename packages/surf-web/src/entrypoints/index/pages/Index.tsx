import { Fragment, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useAtom } from "jotai";
import { Button } from "@nextui-org/react";
import type { ButtonProps } from "@nextui-org/react";
import { NewProfileModel } from "../components/NewProfileModel";
import type { OnOk } from "../components/NewProfileModel";
import { Check, CloseCircleOutlined, Icon, Plus } from "~/icons";
import { useProfiles } from "~/atoms/hooks/useProfiles";
import { isSettingsChangeAtom } from "~/atoms/isSettingsChange";
import { resetFromLocal, saveToLocal } from "~/lib/store";
import { getIconByProfileType } from "~/utils";
import type { IIcon } from "~/icons";

export default function Index() {
  const [isOpenModel, setIsOpenModel] = useState(false);
  const { showProfiles, addProfile } = useProfiles();
  const [isSettingsChange] = useAtom(isSettingsChangeAtom);

  const navigate = useNavigate();
  const { name } = useParams();

  const handleOk: OnOk = ({ name, profileType }) => {
    addProfile({ name, profileType });
    setIsOpenModel(false);

    navigate(`/profile/${name}`);
  };

  const Menu: {
    name: string;
    divider?: boolean;
    children: {
      name: string;
      icon?: IIcon;
      variant?: ButtonProps["variant"];
      color?: ButtonProps["color"];
      disabled?: ButtonProps["disabled"];
      onClick?: () => void;
    }[];
  }[] = [
    {
      name: "情景模式",
      children: [
        ...Object.entries(showProfiles).map(
          ([_key, { name: profileName, profileType }]) => ({
            name: profileName,
            icon: getIconByProfileType(profileType),
            variant:
              name === profileName
                ? "solid"
                : ("light" as ButtonProps["variant"]),
            color: (name === profileName
              ? "primary"
              : undefined) as ButtonProps["color"],
            onClick: () => navigate(`/profile/${profileName}`),
          }),
        ),
        {
          name: "新建情景模式",
          icon: Plus,
          variant: "light",
          onClick: () => setIsOpenModel(true),
        },
      ],
    },
    {
      name: "ACTIONS",
      divider: true,
      children: [
        {
          name: "应用选项",
          icon: Check,
          variant: "flat",
          disabled: !isSettingsChange,
          color: isSettingsChange ? "success" : undefined,
          onClick: () => saveToLocal(),
        },
        {
          name: "撤销更改",
          icon: CloseCircleOutlined,
          variant: "light",
          disabled: !isSettingsChange,
          color: isSettingsChange ? "danger" : undefined,
          onClick: () => resetFromLocal(),
        },
      ],
    },
  ];

  return (
    <>
      <NewProfileModel
        open={isOpenModel}
        setOpen={setIsOpenModel}
        onOk={handleOk}
      />

      <div className="flex h-screen">
        <aside className="w-60 px-8 py-4">
          <h1 className="text-3xl font-bold">Surf Omni</h1>

          <nav className="pt-3">
            <ul className="flex flex-col gap-y-1">
              {Menu.map((item) => (
                <Fragment key={item.name}>
                  {item.divider && <li className="my-2 border-b" />}

                  <li className="py-2 font-mono text-gray-600">{item.name}</li>
                  {item.children.map((i) => (
                    <li key={i.name}>
                      <Button
                        className="w-full justify-start"
                        variant={i.variant}
                        onClick={i.onClick}
                        color={i.color}
                        disabled={i.disabled}
                        startContent={i.icon && <Icon icon={i.icon} />}
                      >
                        {i.name}
                      </Button>
                    </li>
                  ))}
                </Fragment>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="h-full flex-1 overflow-y-scroll">
          <Outlet />
        </main>
      </div>
    </>
  );
}
