const t = require('node:test')
const a = require('node:assert')

const gtr = require('../../ranges/gtr')
const versionGtr = require('../fixtures/version-gt-range')
const versionNotGtr = require('../fixtures/version-not-gt-range')

t.test('gtr tests', (t) => {
  for (const [range, version, options] of versionGtr) {
    a.ok(gtr(version, range, options), `gtr(${version}, ${range}, ${options})`)
  }
})

t.test('negative gtr tests', (t) => {
  for (const [range, version, options] of versionNotGtr) {
    a.ok(!gtr(version, range, options), `!gtr(${version}, ${range}, ${options})`)
  }
})
