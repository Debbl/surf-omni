import type { Condition } from "./conditions";

export type BuiltinProfileType = "DirectProfile" | "SystemProfile";

export type ProfileType = BuiltinProfileType | "FixedProfile" | "SwitchProfile";

export type OptionProfileType = Exclude<ProfileType, BuiltinProfileType>;

export interface BasicProfile {
  name: string;
  profileType: ProfileType;
}

export type IScheme = "http" | "https" | "quic" | "socks4" | "socks5";
export interface FixedProfile extends BasicProfile {
  profileType: "FixedProfile";
  fallbackProxy: {
    scheme: IScheme;
    host: string;
    port: number;
  };
  bypassList: Condition[];
}

export interface SwitchProfile extends BasicProfile {
  profileType: "SwitchProfile";
  fallbackProxy?: {
    scheme: IScheme;
    host: string;
    port: number;
  };
  bypassList: Condition[];
}

export interface DirectProfile extends BasicProfile {
  profileType: "DirectProfile";
}
export interface SystemProfile extends BasicProfile {
  profileType: "SystemProfile";
}

export type Profile =
  | DirectProfile
  | SystemProfile
  | FixedProfile
  | SwitchProfile;

export type Profiles = Record<string, Profile>;

interface IProxy {
  scheme: string;
  host: string;
  port: number;
}

export const pacProtocols = {
  http: "PROXY",
  https: "HTTPS",
  socks4: "SOCKS",
  socks5: "SOCKS5",
};

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

export function nameAsKey(profileName: string) {
  return `+${profileName}`;
}

export function isProfile(profileName: string) {
  return profileName[0] === "+";
}

export function keyAsName(key: string) {
  if (isProfile(key)) return key.slice(1);
  return key;
}

export function getProxyValue(profile: Profile) {
  switch (profile.profileType) {
    case "DirectProfile":
      return {
        mode: "direct",
      };
    case "SystemProfile":
      return {
        mode: "system",
      };
    case "FixedProfile":
      return {
        mode: "fixed_servers",
        rules: {
          proxyForHttp: profile.fallbackProxy,
          bypassList: profile.bypassList.map((item) => item.pattern),
        },
      };
  }
  return {
    mode: "direct",
  };
}
