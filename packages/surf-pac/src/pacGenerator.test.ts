import { astringGenerate } from 'surf-ast'
import { describe, expect, it } from 'vitest'
import { pacGeneratorScript } from './pacGenerator'

const options = {
  '+auto': {
    name: 'auto',
    profileType: 'SwitchProfile',
    revision: 'test',
    defaultProfileName: 'direct',
    rules: [
      {
        profileName: 'proxy',
        condition: {
          conditionType: 'UrlRegexCondition',
          pattern: '^http:\\/\\/(www|www2)\\.example\\.com\\/',
        },
      },
      {
        profileName: 'proxy',
        condition: {
          conditionType: 'KeywordCondition',
          pattern: 'keyword',
        },
      },
      {
        profileName: 'proxy',
        condition: {
          conditionType: 'UrlWildcardCondition',
          pattern: 'https://ssl.example.com/*',
        },
      },
    ],
  },
  '+proxy': {
    name: 'proxy',
    profileType: 'FixedProfile',
    revision: 'test',
    singleProxy: {
      scheme: 'http',
      host: '127.0.0.1',
      port: 8888,
    },
    bypassList: [
      {
        conditionType: 'BypassCondition',
        pattern: '127.0.0.1:8080',
      },
      {
        conditionType: 'BypassCondition',
        pattern: '127.0.0.1',
      },
      {
        conditionType: 'BypassCondition',
        pattern: '<local>',
      },
    ],
  },
} as any

describe('pacGenerator', () => {
  it('should generate pac scripts from options', () => {
    const ast = pacGeneratorScript('auto', options)
    const code = astringGenerate(ast)
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(code).not.to.empty

    // eslint-disable-next-line no-eval
    const func = eval(`(function () { ${code}\n return FindProxyForURL; })()`)

    const result = func('http://www.example.com/', 'www.example.com')
    expect(result).toBe('PROXY 127.0.0.1:8888')
  })
})
