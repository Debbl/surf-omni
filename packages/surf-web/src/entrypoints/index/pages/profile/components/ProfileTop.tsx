import { Button } from "@nextui-org/react";
import { getProxyValue } from "surf-pac";
import type { Profiles } from "surf-pac";
import { ColorPicker } from "~/components/ColorPicker";
import { Download, Icon } from "~/icons";
import { downloadFile } from "~/lib";

export default function ProfileTop({
  name,
  profiles,
  color,
  setColor,
}: {
  name: string;
  profiles: Profiles;
  color: string;
  setColor: (color: string) => void;
}) {
  const exportPacScript = () => {
    const script = getProxyValue(name, profiles);
    const data = script.pacScript?.data || "";

    downloadFile(data, `${name}.pac`);
  };

  return (
    <div className="flex items-center justify-between py-6">
      <div className="flex items-center gap-x-2">
        <ColorPicker value={color} setValue={setColor} />
        <div className="text-2xl font-medium">情景模式：{name}</div>
      </div>
      <div className="px-6">
        <Button
          size="sm"
          startContent={<Icon icon={Download} />}
          onClick={() => exportPacScript()}
        >
          导出PAC
        </Button>
      </div>
    </div>
  );
}
