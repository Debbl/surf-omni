import type { Types } from "webextension-polyfill";

export async function setBrowserProxy(details: Types.SettingSetDetailsType) {
  await browser.proxy.settings.set(details);
}

export async function getBrowserProxy(details: Types.SettingGetDetailsType) {
  return await browser.proxy.settings.get(details);
}
