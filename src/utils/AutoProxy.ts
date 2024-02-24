import { pac } from "./PAC";

class AutoProxy {
  magicPrefix = ["W0F1dG9Qcm94", "[AutoProxy"];

  detect(text: string) {
    return this.magicPrefix.some((prefix) => text.startsWith(prefix));
  }

  preprocess(text: string) {
    return text.startsWith(this.magicPrefix[0]) ? atob(text) : text;
  }

  parse(text: string) {
    return pac.parse(this.preprocess(text));
  }
}

const autoProxy = new AutoProxy();

export { autoProxy };
