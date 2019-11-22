const { test } = require('tap')
const outside = require('../../ranges/outside')
const versionGtr = require('../fixtures/version-gt-range')
const versionNotGtr = require('../fixtures/version-not-gt-range')
const versionLtr = require('../fixtures/version-lt-range')
const versionNotLtr = require('../fixtures/version-not-lt-range')

test('gtr tests', (t) => {
  // [range, version, loose]
  // Version should be greater than range
  versionGtr.forEach(([range, version, loose = false]) => {
    const msg = `outside(${version}, ${range}, > ${loose})`
    t.ok(outside(version, range, '>', loose), msg)
  })
  t.end()
})

test('ltr tests', (t) => {
  // [range, version, loose]
  // Version should be less than range
  versionLtr.forEach(([range, version, loose = false]) => {
    const msg = `outside(${version}, ${range}, <, ${loose})`
    t.ok(outside(version, range, '<', loose), msg)
  })
  t.end()
})

test('negative gtr tests', (t) => {
  // [range, version, loose]
  // Version should NOT be greater than range
  versionNotGtr.forEach(([range, version, loose = false]) => {
    const msg = `!outside(${version}, ${range}, > ${loose})`
    t.notOk(outside(version, range, '>', loose), msg)
  })
  t.end()
})

test('negative ltr tests', (t) => {
  // [range, version, loose]
  // Version should NOT be less than range
  versionNotLtr.forEach(([range, version, loose = false]) => {
    const msg = `!outside(${version}, ${range}, < ${loose})`
    t.notOk(outside(version, range, '<', loose), msg)
  })
  t.end()
})

test('outside with bad hilo throws', (t) => {
  t.throws(() => {
    outside('1.2.3', '>1.5.0', 'blerg', true)
  }, new TypeError('Must provide a hilo val of "<" or ">"'))
  t.end()
})
