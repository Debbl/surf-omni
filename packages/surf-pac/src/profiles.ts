interface IProxy {
  scheme: string;
  host: string;
  port: number;
}

const builtinProfiles = {
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

const schemes = [
  { scheme: "http", prop: "proxyForHttp" },
  { scheme: "https", prop: "proxyForHttps" },
  { scheme: "ftp", prop: "proxyForFtp" },
  { scheme: "", prop: "fallbackProxy" },
];

const pacProtocols = {
  http: "PROXY",
  https: "HTTPS",
  socks4: "SOCKS",
  socks5: "SOCKS5",
};

const formatByType = {
  SwitchyRuleListProfile: "Switchy",
  AutoProxyRuleListProfile: "AutoProxy",
};

const ruleListFormats = ["Switchy", "AutoProxy"];

function parseHostPort(str: string, scheme: string): IProxy {
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

function pacResult(proxy: IProxy) {
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

function isFileUrl(url: string) {
  return url.slice(0, 5).toUpperCase() === "FILE:";
}
function nameAsKey(profileName: string | { name: string }) {
  return typeof profileName === "string"
    ? `+${profileName}`
    : `+${profileName.name}`;
}

export const profiles = {
  builtinProfiles,
  schemes,
  pacProtocols,
  formatByType,
  ruleListFormats,
  parseHostPort,
  pacResult,
  isFileUrl,
};
