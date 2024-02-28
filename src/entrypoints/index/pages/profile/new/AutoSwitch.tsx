import { useState } from "react";
import { useGlobalStore } from "@/store";

export default function AutoSwitch() {
  const { currentAutoProxy, setAutoProxy, setMode } = useGlobalStore(
    (state) => ({
      currentAutoProxy: state.autoProxy,
      setAutoProxy: state.setAutoProxy,
      parserAutoProxy: state.parserAutoProxy,
      setMode: state.setMode,
    }),
  );
  const [text, setText] = useState("");

  async function handleGetAutoProxy() {
    setMode("fixed_servers");
    const response = await fetch(currentAutoProxy);
    const _text = await response.text();

    setText(autoProxy.preprocess(_text));
  }
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-y-2">
        <h3 className="pl-2 text-xl font-bold">规则列表设置</h3>

        <div className="flex w-full items-center pl-2">
          <label className="flex items-center gap-x-2">
            <span className="w-28">规则列表网址</span>
            <input
              type="text"
              placeholder="请输入规则列表网址"
              value={currentAutoProxy}
              onChange={(e) => setAutoProxy(e.target.value)}
              className="input input-sm input-bordered w-[32rem] flex-1"
            />
          </label>

          <button
            className="btn btn-primary btn-active btn-sm ml-2"
            onClick={() => handleGetAutoProxy()}
          >
            立即更新
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center gap-y-2 px-2 py-10">
        <textarea
          className="textarea size-full"
          disabled
          value={text}
        ></textarea>
      </div>
    </div>
  );
}
