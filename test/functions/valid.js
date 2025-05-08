'use strict'

const t = require('tap')
const valid = require('../../functions/valid')
const SemVer = require('../../classes/semver')
const invalidVersions = require('../fixtures/invalid-versions')
const { MAX_SAFE_INTEGER } = require('../../internal/constants')

t.test('returns null instead of throwing when presented with garbage', t => {
  t.plan(invalidVersions.length)
  invalidVersions.forEach(([v, msg, opts]) =>
    t.equal(valid(v, opts), null, msg))
})

t.test('validate a version into a SemVer object', t => {
  t.equal(valid('1.2.3'), '1.2.3')
  const s = new SemVer('4.5.6')
  t.equal(valid(s), '4.5.6', 'return the version if a SemVer obj')
  t.equal(valid('4.2.0foo', true), '4.2.0-foo', 'looseness as a boolean')
  t.equal(valid('4.2.0foo', { loose: true }), '4.2.0-foo', 'looseness as an option')
  t.end()
})

t.test('long build id', t => {
  const longBuild = '-928490632884417731e7af463c92b034d6a78268fc993bcb88a57944'
  const shortVersion = '1.1.1'
  const longVersion = `${MAX_SAFE_INTEGER}.${MAX_SAFE_INTEGER}.${MAX_SAFE_INTEGER}`
  t.equal(valid(shortVersion + longBuild), shortVersion + longBuild)
  t.equal(valid(longVersion + longBuild), longVersion + longBuild)
  t.end()
})
