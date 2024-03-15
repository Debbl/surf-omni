async function handleOpenSetting() {
  const url = `chrome-extension://${browser.runtime.id}/index.html`;
  const tabs = await browser.tabs.query({ url });

  if (tabs.length !== 0) {
    await browser.tabs.update(tabs[0].id, { active: true });
  } else {
    browser.tabs.create({
      url,
    });
  }
}

export default function App() {
  return (
    <>
      <div>
        <button onClick={handleOpenSetting}>setting</button>
      </div>
    </>
  );
}
