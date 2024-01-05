const t = require('node:test')
const a = require('node:assert')

const ltr = require('../../ranges/ltr')
const versionLtr = require('../fixtures/version-lt-range')
const versionNotLtr = require('../fixtures/version-not-lt-range')

t.test('ltr tests', (t) => {
  for (const [range, version, options] of versionLtr) {
    a.ok(ltr(version, range, options), `ltr(${version}, ${range}, ${options})`)
  }
})

t.test('negative ltr tests', (t) => {
  for (const [range, version, options] of versionNotLtr) {
    a.ok(!ltr(version, range, options), `!ltr(${version}, ${range}, ${options})`)
  }
})
