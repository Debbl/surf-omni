import { Button } from "@nextui-org/react";
import { useProfiles } from "~/atoms/hooks/useProfiles";
import { projectName } from "~/constants";
import { saveToLocal, storageCurrentProfileName } from "~/lib";
import { downloadFile } from "~/utils";

function triggerSelectFile() {
  return new Promise<File | undefined>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".bak";
    input.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      resolve(target?.files?.[0]);
    });
    input.click();
  });
}

export default function ImportAndExport() {
  const { profiles, setProfiles } = useProfiles();

  const handleImport = async () => {
    const backFile = await triggerSelectFile();
    if (!backFile) return;

    const content = JSON.parse(await backFile.text());
    const profiles = Object.fromEntries(
      Object.entries(content).filter(([key]) => key.startsWith("+")),
    ) as any;
    console.log("🚀 ~ handleImport ~ profiles:", profiles);
    setProfiles(profiles);

    await storageCurrentProfileName.set("[direct]");
    await saveToLocal();
  };

  const handleExport = () => {
    downloadFile(JSON.stringify(profiles), `${projectName}.bak`);
  };

  return (
    <>
      <div>
        <div className="py-6">
          <h2 className="text-2xl font-medium">导入/导出</h2>
        </div>

        <div className="border-b"></div>
      </div>

      <main className="flex gap-x-2 pt-2">
        <Button size="sm" variant="bordered" onClick={handleImport}>
          导入
        </Button>

        <Button size="sm" onClick={handleExport}>
          导出
        </Button>
      </main>
    </>
  );
}
