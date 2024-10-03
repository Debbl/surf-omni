/* eslint-disable no-console */
import { useEffect } from "react";

async function test() {
  await browser.proxy.settings.set({
    value: {
      mode: "fixed_servers",
      rules: {
        singleProxy: {
          scheme: "http",
          host: "127.0.0.1",
          port: 7890,
        },
        bypassList: ["foobar.com"],
      },
    },
  });
}

export default function Test() {
  useEffect(() => {
    setInterval(async () => {
      const v = await browser.proxy.settings.get({});
      console.log("🚀 ~ setInterval ~ v:", v);
    }, 3000);
  }, []);

  return (
    <div>
      <button onClick={() => test()}>test</button>
    </div>
  );
}
