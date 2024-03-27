import { preprocess } from "surf-pac";
import { Button } from "~/components/Button";
import { useProfile } from "@/entrypoints/index/hooks/useProfile";
import type {
  SwitchProfile as ISwitchProfile,
  RuleListProfile,
} from "surf-pac";

const handleUpdateSource = async (
  url: string,
  updateRaw: (raw: string) => void,
) => {
  const response = await fetch(url);
  const raw = await response.text();

  updateRaw(preprocess(raw));
};

export default function SwitchProfile({
  profileName,
}: {
  profileName: string;
}) {
  const { profile: switchProfile } = useProfile<ISwitchProfile>(profileName);
  const { profile: ruleListProfile, setProfile: setRuleListProfile } =
    useProfile<RuleListProfile>(switchProfile.defaultProfileName);

  return (
    <div>
      <div className="flex items-center justify-between py-6">
        <div className="text-2xl font-medium">
          情景模式：{switchProfile.name}
        </div>
      </div>
      <div className="border-b" />

      <div className="pt-4">
        <div>
          <div className="text-2xl">切换规则</div>
          <div className="mt-6 flex w-full items-center gap-x-2 text-sm">
            <div>规则列表网址</div>
            <div>
              <input
                value={ruleListProfile.url}
                className="w-[30rem] rounded-sm border px-2 py-1"
                type="text"
                onChange={(e) => {
                  setRuleListProfile({
                    ...ruleListProfile,
                    url: e.target.value,
                  });
                }}
              />
            </div>
            <Button
              onClick={() => {
                handleUpdateSource(ruleListProfile.url, (raw) => {
                  setRuleListProfile({
                    ...ruleListProfile,
                    raw,
                  });
                });
              }}
              className="w-20 justify-center bg-blue-600 text-center text-white hover:bg-blue-700"
            >
              更新
            </Button>
          </div>
          <div>规则列表规则</div>
          <input
            value={ruleListProfile.matchProfileName}
            className="w-[30rem] rounded-sm border px-2 py-1"
            type="text"
            onChange={(e) => {
              setRuleListProfile({
                ...ruleListProfile,
                matchProfileName: e.target.value,
              });
            }}
          />
        </div>

        <div>
          <div className="mb-2 mt-6 text-2xl">规则列表设置</div>
        </div>

        <div>
          <div className="mb-2 mt-6 text-2xl">规则列表正文</div>
          <textarea
            defaultValue={ruleListProfile.raw}
            rows={8}
            className="w-[80%] rounded-sm border p-2"
          />
        </div>
      </div>
    </div>
  );
}
