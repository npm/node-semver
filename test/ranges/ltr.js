const { test } = require('tap')
const ltr = require('../../ranges/ltr')
const versionLtr = require('../fixtures/version-lt-range')
const versionNotLtr = require('../fixtures/version-not-lt-range')

test('ltr tests', (t) => {
  // [range, version, loose]
  // Version should be less than range
  versionLtr.forEach(([range, version, loose = false]) => {
    const msg = `ltr(${version}, ${range}, ${loose})`
    t.ok(ltr(version, range, loose), msg)
  })
  t.end()
})

test('negative ltr tests', (t) => {
  // [range, version, loose]
  // Version should NOT be less than range
  versionNotLtr.forEach(([range, version, loose = false]) => {
    const msg = `!ltr(${version}, ${range}, ${loose})`
    t.notOk(ltr(version, range, loose), msg)
  })
  t.end()
})
