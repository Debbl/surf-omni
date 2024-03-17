import { useEffect, useState } from "react";
import { Model } from "~/components/Model";
import type { BuiltinProfileType, ProfileType } from "surf-pac";

export type OptionProfileType = Exclude<ProfileType, BuiltinProfileType>;
export type OnOk = (value: {
  name: string;
  profileType: OptionProfileType;
}) => void;

function Radio(props: {
  type: OptionProfileType;
  value: OptionProfileType;
  title: string;
  desc: string;
  setType: (type: OptionProfileType) => void;
}) {
  const { type, value, title, desc, setType } = props;

  return (
    <label className="flex cursor-pointer items-start gap-x-2">
      <input
        className="mt-1"
        type="radio"
        value={value}
        checked={type === value}
        onChange={() => setType(value)}
      />
      <div className="flex flex-col gap-y-1">
        <div>{title}</div>
        <div>{desc}</div>
      </div>
    </label>
  );
}

export function NewProfileModel(props: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onOk?: OnOk;
}) {
  const { open, setOpen, onOk } = props;
  const [name, setName] = useState("");
  const [profileType, setProfileType] =
    useState<OptionProfileType>("FixedProfile");

  useEffect(() => {
    if (open) {
      setName("");
      setProfileType("FixedProfile");
    }
  }, [open]);

  return (
    <Model
      title="新建情景模式"
      open={open}
      onCancel={() => setOpen(false)}
      onOk={() => onOk?.({ name, profileType })}
      className="w-[30rem]"
    >
      <div className="mb-2 text-sm">情景模式名称</div>
      <input
        type="text"
        className="h-8 w-full rounded-md border px-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="my-2 text-sm">请选择情景模式的类型:</div>
      <div className="flex flex-col gap-y-2">
        <Radio
          type={profileType}
          value="FixedProfile"
          title="代理服务器"
          desc="经过代理服务器访问网站。"
          setType={setProfileType}
        />

        <Radio
          type={profileType}
          value="SwitchProfile"
          title="自动切换模式"
          desc="根据多种条件，如域名或网址等自动选择情景模式。您也可以导入在线发布的切换规则（如 AutoProxy 列表）以简化设置。"
          setType={setProfileType}
        />
      </div>
    </Model>
  );
}
