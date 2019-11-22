const t = require('tap')
const parse = require('../../functions/parse')
const SemVer = require('../../classes/semver')
const invalidVersions = require('../fixtures/invalid-versions')

t.test('returns null instead of throwing when presented with garbage', t => {
  t.plan(invalidVersions.length)
  invalidVersions.forEach(([v, msg, opts]) =>
    t.equal(parse(v, opts), null, msg))
})

t.test('parse a version into a SemVer object', t => {
  t.match(parse('1.2.3'), new SemVer('1.2.3'))
  const s = new SemVer('4.5.6')
  t.equal(parse(s), s, 'just return it if its a SemVer obj')
  const loose = new SemVer('4.2.0', { loose: true })
  t.match(parse('4.2.0', true), loose, 'looseness as a boolean')
  t.match(parse('4.2.0', { loose: true }), loose, 'looseness as an option')
  t.end()
})
