import { useGlobalStore } from "@/store";

function App() {
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
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col gap-y-2 items-center">
        <div>Input AutoProxy</div>
        <div>
          <input
            className="border h-8 w-60 rounded-sm"
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

export default App;
