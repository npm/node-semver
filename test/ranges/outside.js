const t = require('node:test')
const a = require('node:assert')
const outside = require('../../ranges/outside')
const versionGtr = require('../fixtures/version-gt-range')
const versionNotGtr = require('../fixtures/version-not-gt-range')
const versionLtr = require('../fixtures/version-lt-range')
const versionNotLtr = require('../fixtures/version-not-lt-range')

t.test('gtr tests', (t) => {
  for (const [range, version, options] of versionGtr) {
    a.ok(outside(version, range, '>', options), `outside(${version}, ${range}, > ${options})`)
  }
})

t.test('ltr tests', (t) => {
  for (const [range, version, options] of versionLtr) {
    a.ok(outside(version, range, '<', options), `outside(${version}, ${range}, <, ${options})`)
  }
})

t.test('negative gtr tests', (t) => {
  for (const [range, version, options] of versionNotGtr) {
    a.ok(!outside(version, range, '>', options), `!outside(${version}, ${range}, > ${options})`)
  }
})

t.test('negative ltr tests', (t) => {
  for (const [range, version, options] of versionNotLtr) {
    a.ok(!outside(version, range, '<', options), `!outside(${version}, ${range}, < ${options})`)
  }
})

t.test('outside with bad hilo throws', (t) => {
  a.throws(() => {
    outside('1.2.3', '>1.5.0', 'blerg', true)
  }, new TypeError('Must provide a hilo val of "<" or ">"'))
})
