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
  // eslint-disable-next-line no-console
  console.log("🚀 ~ setInterval ~ v:", v);
}, 3000);

export default function Test() {
  return (
    <div>
      <button onClick={() => test()}>test</button>
    </div>
  );
}
