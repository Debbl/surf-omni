import { version } from "~/constants";

export default function Index() {
  return (
    <div>
      <div>
        <div className="py-6">
          <h2 className="text-2xl font-medium">关于</h2>
        </div>

        <div className="border-b"></div>
      </div>

      <div className="mt-4 flex items-center gap-x-2">
        <img className="size-10" src="/icon/128.png" alt="" />
        <h3 className="text-lg">Surf Omni</h3>
      </div>

      <div className="mt-4 text-medium">Version {version}</div>

      <div className="mt-4 flex items-center gap-x-2">
        <a
          href="https://github.com/Debbl/surf-omni"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          源码
        </a>
        <a
          href="https://github.com/Debbl/surf-omni/issues"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          报告问题
        </a>
      </div>
    </div>
  );
}
