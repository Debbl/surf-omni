export async function setBrowserProxy(details: { value: any }) {
  await browser.proxy.settings.set(details);
}

export async function getBrowserProxy(details: { incognito?: boolean }) {
  return await browser.proxy.settings.get(details);
}
