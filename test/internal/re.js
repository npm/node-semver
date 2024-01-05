const t = require('node:test')
const a = require('node:assert')

const { src, re, safeRe } = require('../../internal/re')
const semver = require('../../')

t.test('has a list of src, re, and tokens', (t) => {
  a.ok(Array.isArray(semver.src), 'src is an array')
  a.ok(Array.isArray(semver.re), 're is an array')
  a.equal(typeof semver.tokens, 'object', 'tokesn is an object')
  for (const r of re) {
    a.ok(r instanceof RegExp, 'regexps are regexps')
  }
  for (const s of src) {
    a.equal(typeof s, 'string', 'src is strings')
  }
  for (const i in semver.tokens) {
    a.equal(typeof semver.tokens[i], 'number', 'tokens are numbers')
  }

  safeRe.forEach(r => {
    a.ok(!r.source.includes('\\s+'), 'safe regex do not contain greedy whitespace')
    a.ok(!r.source.includes('\\s*'), 'safe regex do not contain greedy whitespace')
  })
})
