export async function setBrowserProxy(details: { value: any }) {
  await browser.proxy.settings.set(details);
}
