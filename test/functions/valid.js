const t = require('node:test')
const a = require('node:assert')

const valid = require('../../functions/valid')
const SemVer = require('../../classes/semver')
const invalidVersions = require('../fixtures/invalid-versions')
const { MAX_SAFE_INTEGER } = require('../../internal/constants')

t.test('returns null instead of throwing when presented with garbage', t => {
  for (const [v, msg, opts] of invalidVersions) {
    a.deepEqual(valid(v, opts), null, msg)
  }
})

t.test('validate a version into a SemVer object', t => {
  a.equal(valid('1.2.3'), '1.2.3')
  const s = new SemVer('4.5.6')
  a.equal(valid(s), '4.5.6', 'return the version if a SemVer obj')
  a.equal(valid('4.2.0foo', true), '4.2.0-foo', 'looseness as a boolean')
  a.equal(valid('4.2.0foo', { loose: true }), '4.2.0-foo', 'looseness as an option')
})

t.test('long build id', t => {
  const longBuild = '-928490632884417731e7af463c92b034d6a78268fc993bcb88a57944'
  const shortVersion = '1.1.1'
  const longVersion = `${MAX_SAFE_INTEGER}.${MAX_SAFE_INTEGER}.${MAX_SAFE_INTEGER}`
  a.equal(valid(shortVersion + longBuild), shortVersion + longBuild)
  a.equal(valid(longVersion + longBuild), longVersion + longBuild)
})
