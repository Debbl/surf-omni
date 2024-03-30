import { Fragment, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useAtom } from "jotai";
import { Button } from "~/components/Button";
import { Check, CloseCircleOutlined, Icon, Plus } from "~/icons";
import { useProfiles } from "~/atoms/hooks/useProfiles";
import { isSettingsChangeAtom } from "~/atoms/isSettingsChange";
import { resetFromLocal, saveToLocal } from "~/lib/store";
import { NewProfileModel } from "../components/NewProfileModel";
import type { ButtonProps } from "~/components/Button";
import type { IIcon } from "~/icons";
import type { OnOk } from "../components/NewProfileModel";

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
      active?: ButtonProps["active"];
      disabled?: ButtonProps["disabled"];
      onClick?: () => void;
    }[];
  }[] = [
    {
      name: "情景模式",
      children: [
        ...Object.entries(showProfiles).map(([_key, profile]) => ({
          name: profile.name,
          active: (name === profile.name
            ? "info"
            : undefined) as ButtonProps["active"],
          onClick: () => navigate(`/profile/${profile.name}`),
        })),
        {
          name: "新建情景模式",
          icon: Plus,
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
          variant: "outline",
          disabled: !isSettingsChange,
          active: isSettingsChange ? "success" : undefined,
          onClick: () => saveToLocal(),
        },
        {
          name: "撤销更改",
          icon: CloseCircleOutlined,
          variant: "outline",
          disabled: !isSettingsChange,
          active: isSettingsChange ? "failure" : undefined,
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

      <div className="flex h-full">
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
                        variant={i.variant || "ghost"}
                        onClick={i.onClick}
                        active={i.active}
                        disabled={i.disabled}
                      >
                        {i.icon && <Icon icon={i.icon} />}
                        {i.name}
                      </Button>
                    </li>
                  ))}
                </Fragment>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </>
  );
}
