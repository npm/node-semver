const { test } = require('tap')
const semver = require('../')

test('long version is too long', (t) => {
  const v = `1.2.${  new Array(256).join('1')}`
  t.throws(() => {
    new semver.SemVer(v) // eslint-disable-line no-new
  })
  t.equal(semver.valid(v, false), null)
  t.equal(semver.valid(v, true), null)
  t.equal(semver.inc(v, 'patch'), null)
  t.end()
})

test('big number is like too long version', (t) => {
  const v = `1.2.${  new Array(100).join('1')}`
  t.throws(() => {
    new semver.SemVer(v) // eslint-disable-line no-new
  })
  t.equal(semver.valid(v, false), null)
  t.equal(semver.valid(v, true), null)
  t.equal(semver.inc(v, 'patch'), null)
  t.end()
})

test('parsing null does not throw', (t) => {
  t.equal(semver.parse(null), null)
  t.equal(semver.parse({}), null)
  t.equal(semver.parse(new semver.SemVer('1.2.3')).version, '1.2.3')
  t.end()
})
