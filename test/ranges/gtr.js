const { test } = require('tap')
const gtr = require('../../ranges/gtr')
const versionGtr = require('../fixtures/version-gt-range')
const versionNotGtr = require('../fixtures/version-not-gt-range')

test('gtr tests', (t) => {
  // [range, version, loose]
  // Version should be greater than range
  versionGtr.forEach((tuple) => {
    const range = tuple[0]
    const version = tuple[1]
    const loose = tuple[2] || false
    const msg = `gtr(${version}, ${range}, ${loose})`
    t.ok(gtr(version, range, loose), msg)
  })
  t.end()
})

test('negative gtr tests', (t) => {
  // [range, version, loose]
  // Version should NOT be greater than range
  versionNotGtr.forEach((tuple) => {
    const range = tuple[0]
    const version = tuple[1]
    const loose = tuple[2] || false
    const msg = `!gtr(${version}, ${range}, ${loose})`
    t.notOk(gtr(version, range, loose), msg)
  })
  t.end()
})
