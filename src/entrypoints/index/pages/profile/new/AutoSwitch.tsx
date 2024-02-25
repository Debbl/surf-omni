import { useGlobalStore } from "@/store";

export default function AutoSwitch() {
  const { autoProxy, setAutoProxy, parserAutoProxy } = useGlobalStore(
    (state) => ({
      autoProxy: state.autoProxy,
      setAutoProxy: state.setAutoProxy,
      parserAutoProxy: state.parserAutoProxy,
    }),
  );

  async function handleGetAutoProxy() {
    const done = await parserAutoProxy();

    if (!done) {
      // eslint-disable-next-line no-alert
      alert("error");
    } else {
      // eslint-disable-next-line no-alert
      alert("success");
    }
  }
  return (
    <div>
      auto switch
      <div className="flex flex-1 flex-col items-center gap-y-2">
        <div>Input AutoProxy</div>
        <div>
          <input
            className="h-8 w-60 rounded-sm border"
            value={autoProxy}
            onChange={(e) => setAutoProxy(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={() => handleGetAutoProxy()}>
          getAutoProxy
        </button>
      </div>
    </div>
  );
}
