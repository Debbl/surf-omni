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

setInterval(async () => {
  const v = await browser.proxy.settings.get({});
  console.log("🚀 ~ setInterval ~ v:", v);
}, 3000);

export default function Test() {
  useEffect(() => {}, []);
  return (
    <div>
      <button onClick={() => test()}>test</button>
    </div>
  );
}
