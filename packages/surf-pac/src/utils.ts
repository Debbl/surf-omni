import type { Scheme } from './profiles'

export interface IProxy {
  scheme: Scheme
  host: string
  port: number
}

export const pacProtocols = {
  http: 'PROXY',
  https: 'HTTPS',
  socks4: 'SOCKS',
  socks5: 'SOCKS5',
}

export function pacResult(proxy?: IProxy) {
  if (!proxy) {
    return 'DIRECT'
  }

  const { scheme, host, port } = proxy
  if (scheme === 'socks5') {
    return `SOCKS5 ${host}:${port}; SOCKS ${host}:${port}`
  } else {
    return `${pacProtocols[scheme]} ${host}:${port}`
  }
}

export function isFileUrl(url: string) {
  return url.slice(0, 5).toUpperCase() === 'FILE:'
}

export function nameAsKey(profileName: string) {
  return `+${profileName}`
}

export function isProfile(profileName: string) {
  return profileName[0] === '+'
}

export function keyAsName(key: string) {
  if (isProfile(key)) return key.slice(1)
  return key
}
