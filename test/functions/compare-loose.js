const t = require('node:test')
const a = require('node:assert')

const compareLoose = require('../../functions/compare-loose')
const SemVer = require('../../classes/semver')
const eq = require('../../functions/eq')

const toCompare = require('../fixtures/compare-loose')

t.test('strict vs loose version numbers', (t) => {
  for (const [loose, strict] of toCompare) {
    a.throws(() => {
      SemVer(loose) // eslint-disable-line no-new
    })
    const lv = new SemVer(loose, true)
    a.equal(lv.version, strict)
    a.ok(eq(loose, strict, true))
    a.throws(() => {
      eq(loose, strict)
    })
    a.throws(() => {
      new SemVer(strict).compare(loose)
    })
    a.equal(compareLoose(loose, strict), 0)
  }
})
