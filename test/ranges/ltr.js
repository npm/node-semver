const { test } = require('tap')
const ltr = require('../../ranges/ltr')
const versionLtr = require('../fixtures/version-lt-range')
const versionNotLtr = require('../fixtures/version-not-lt-range')

test('ltr tests', (t) => {
  // [range, version, options]
  // Version should be less than range
  versionLtr.forEach(([range, version, options = false]) => {
    const msg = `ltr(${version}, ${range}, ${options})`
    t.ok(ltr(version, range, options), msg)
  })
  t.end()
})

test('negative ltr tests', (t) => {
  // [range, version, options]
  // Version should NOT be less than range
  versionNotLtr.forEach(([range, version, options = false]) => {
    const msg = `!ltr(${version}, ${range}, ${options})`
    t.notOk(ltr(version, range, options), msg)
  })
  t.end()
})
