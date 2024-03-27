import { Fragment, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useAtom } from "jotai";
import { twMerge } from "~/lib/tw";
import { Button } from "~/components/Button";
import { Check, CloseCircleOutlined, Plus } from "~/icons";
import { useProfiles } from "~/atoms/hooks/useProfiles";
import { isSettingsChangeAtom } from "~/atoms/isSettingsChange";
import { resetFromLocal, saveToLocal } from "~/lib/store";
import { NewProfileModel } from "../components/NewProfileModel";
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
      className?: string;
      onClick?: () => void;
    }[];
  }[] = [
    {
      name: "情景模式",
      children: [
        ...Object.entries(showProfiles).map(([_key, profile]) => ({
          name: profile.name,
          className:
            name === profile.name
              ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:border-blue-700"
              : "",
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
          className: isSettingsChange ? "border-green-600 text-green-600" : "",
          onClick: () => saveToLocal(),
        },
        {
          name: "撤销更改",
          icon: CloseCircleOutlined,
          className: isSettingsChange ? "border-red-600 text-red-600" : "",
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
            <ul>
              {Menu.map((item) => (
                <Fragment key={item.name}>
                  {item.divider && <li className="my-2 border-b" />}

                  <li className="py-2 font-mono text-gray-600">{item.name}</li>
                  {item.children.map((i) => (
                    <li key={i.name}>
                      <Button
                        leftIcon={i?.icon}
                        onClick={i.onClick}
                        className={twMerge(
                          "mb-1 border border-transparent rounded-md",
                          i.className,
                        )}
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

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </>
  );
}
