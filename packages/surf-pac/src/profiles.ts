interface IProxy {
  scheme: string;
  host: string;
  port: number;
}

export const builtinProfiles = {
  "+direct": {
    name: "direct",
    profileType: "DirectProfile",
    color: "#aaaaaa",
    builtin: true,
  },
  "+system": {
    name: "system",
    profileType: "SystemProfile",
    color: "#000000",
    builtin: true,
  },
};

export interface IScheme {
  scheme: "http" | "https" | "ftp" | "";
  prop: "proxyForHttp" | "proxyForHttps" | "proxyForFtp" | "fallbackProxy";
}
export const schemes: IScheme[] = [
  { scheme: "http", prop: "proxyForHttp" },
  { scheme: "https", prop: "proxyForHttps" },
  { scheme: "ftp", prop: "proxyForFtp" },
  { scheme: "", prop: "fallbackProxy" },
];

export const pacProtocols = {
  http: "PROXY",
  https: "HTTPS",
  socks4: "SOCKS",
  socks5: "SOCKS5",
};

export const formatByType = {
  SwitchyRuleListProfile: "Switchy",
  AutoProxyRuleListProfile: "AutoProxy",
};

export const ruleListFormats = ["Switchy", "AutoProxy"];

export function parseHostPort(str: string, scheme: string): IProxy {
  const sep = str.lastIndexOf(":");
  if (sep < 0) {
    return;
  }

  const port = Number.parseInt(str.slice(sep + 1)) || 80;
  const host = str.slice(0, sep);

  if (!host) {
    return;
  }

  return {
    scheme,
    host,
    port,
  };
}

export function pacResult(proxy?: IProxy) {
  if (!proxy) {
    return "DIRECT";
  }

  const { scheme, host, port } = proxy;
  if (scheme === "socks5") {
    return `SOCKS5 ${host}:${port}; SOCKS ${host}:${port}`;
  } else {
    return `${pacProtocols[scheme]} ${host}:${port}`;
  }
}

export function isFileUrl(url: string) {
  return url.slice(0, 5).toUpperCase() === "FILE:";
}

export function nameAsKey(profileName: string | { name: string }) {
  return typeof profileName === "string"
    ? `+${profileName}`
    : `+${profileName.name}`;
}

export function byName(profileName: string, options?: any) {
  if (typeof profileName === "string") {
    const key = nameAsKey(profileName);
    return builtinProfiles[key] || options[key];
  }

  return profileName;
}
