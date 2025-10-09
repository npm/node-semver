'use strict'

const t = require('node:test')
const a = require('node:assert')
const parse = require('../../functions/parse')
const SemVer = require('../../classes/semver')
const invalidVersions = require('../fixtures/invalid-versions')

t.test('returns null instead of throwing when presented with garbage', () => {
  for (const [v, msg, opts] of invalidVersions) {
    a.equal(parse(v, opts), null, msg)
  }
})

t.test('throw errors if asked to', () => {
  a.throws(() => {
    parse('bad', null, true)
  }, {
    name: 'TypeError',
    message: 'Invalid Version: bad',
  })
  a.throws(() => {
    parse([], null, true)
  }, {
    name: 'TypeError',
    message: 'Invalid version. Must be a string. Got type "object".',
  })
})

t.test('parse a version into a SemVer object', () => {
  a.deepEqual(parse('1.2.3'), new SemVer('1.2.3'))
  const s = new SemVer('4.5.6')
  a.equal(parse(s), s, 'just return it if its a SemVer obj')
  const loose = new SemVer('4.2.0', { loose: true })
  a.deepEqual(parse('4.2.0', true), loose, 'looseness as a boolean')
  a.deepEqual(parse('4.2.0', { loose: true }), loose, 'looseness as an option')
})
