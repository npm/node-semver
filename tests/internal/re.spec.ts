import { test } from '@japa/runner'
import { src, re, safeRe, safeSrc } from '../../src/internal/re.js'
import semver from '../../src/index.js'

test.group('Semver regex and tokens tests', () => {
  test('Semver itself has a list of src, re, and tokens', ({ assert }) => {
    assert.isArray(semver.re, 'semver.re should be an array')
    assert.isArray(semver.src, 'semver.src should be an array')
    assert.isObject(semver.tokens, 'semver.tokens should be an object')

    re.forEach((r) => assert.instanceOf(r, RegExp, 'regexps are regexps'))
    safeRe.forEach((r) => assert.instanceOf(r, RegExp, 'safe regexps are regexps'))
    src.forEach((s) => assert.isString(s, 'src are strings'))
    safeSrc.forEach((s) => assert.isString(s, 'safe src are strings'))

    assert.isAbove(Object.keys(semver.tokens).length, 0, 'there are tokens')
    for (const key in semver.tokens) {
      assert.isNumber(semver.tokens[key], `token ${key} is a number`)
    }

    safeRe.forEach((r) => {
      assert.notInclude(r.source, '\\s+', 'safe regex do not contain greedy whitespace')
      assert.notInclude(r.source, '\\s*', 'safe regex do not contain greedy whitespace')
    })
  })
})
