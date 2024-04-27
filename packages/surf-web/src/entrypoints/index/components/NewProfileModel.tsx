import { useEffect, useState } from "react";
import type { BuiltinProfileType, ProfileType } from "surf-pac";
import { Input } from "~/components/Input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/Dialog";
import { Button } from "~/components/Button";

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
        <div className="text-xs">{title}</div>
        <div className="text-xs text-gray-600">{desc}</div>
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

  const handleOk = () => {
    if (!name) return;

    onOk?.({ name, profileType });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建情景模式</DialogTitle>
        </DialogHeader>

        <div className="my-3 text-sm">情景模式名称</div>
        <Input
          type="text"
          className="h-8 w-full rounded-md border px-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="my-3 text-sm">请选择情景模式的类型:</div>
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

        <DialogFooter>
          <Button
            className="w-20 justify-center"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            取消
          </Button>
          <Button
            className="w-20 justify-center"
            variant="default"
            onClick={() => handleOk()}
          >
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
