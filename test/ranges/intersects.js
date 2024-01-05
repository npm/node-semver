const t = require('node:test')
const a = require('node:assert')

const intersects = require('../../ranges/intersects')
const Range = require('../../classes/range')
const Comparator = require('../../classes/comparator')
const comparatorIntersection = require('../fixtures/comparator-intersection.js')
const rangeIntersection = require('../fixtures/range-intersection.js')

t.test('intersect comparators', async t => {
  for (const [c0, c1, expect, includePrerelease] of comparatorIntersection) {
    await t.test(`${c0} ${c1} ${expect}`, t => {
      const opts = { loose: false, includePrerelease }
      const comp0 = new Comparator(c0)
      const comp1 = new Comparator(c1)

      a.equal(intersects(comp0, comp1, opts), expect, `${c0} intersects ${c1} objects`)
      a.equal(intersects(comp1, comp0, opts), expect, `${c1} intersects ${c0} objects`)
      a.equal(intersects(c0, c1, opts), expect, `${c0} intersects ${c1}`)
      a.equal(intersects(c1, c0, opts), expect, `${c1} intersects ${c0}`)

      opts.loose = true
      a.equal(intersects(comp0, comp1, opts), expect, `${c0} intersects ${c1} loose, objects`)
      a.equal(intersects(comp1, comp0, opts), expect, `${c1} intersects ${c0} loose, objects`)
      a.equal(intersects(c0, c1, opts), expect, `${c0} intersects ${c1} loose`)
      a.equal(intersects(c1, c0, opts), expect, `${c1} intersects ${c0} loose`)
    })
  }
})

t.test('ranges intersect', async t => {
  for (const [r0, r1, expect] of rangeIntersection) {
    await t.test(`${r0} <~> ${r1}`, t => {
      const range0 = new Range(r0)
      const range1 = new Range(r1)

      a.equal(intersects(r1, r0), expect, `${r0} <~> ${r1}`)
      a.equal(intersects(r0, r1), expect, `${r1} <~> ${r0}`)
      a.equal(intersects(r1, r0, true), expect, `${r0} <~> ${r1} loose`)
      a.equal(intersects(r0, r1, true), expect, `${r1} <~> ${r0} loose`)
      a.equal(intersects(range0, range1), expect, `${r0} <~> ${r1} objects`)
      a.equal(intersects(range1, range0), expect, `${r1} <~> ${r0} objects`)
      a.equal(intersects(range0, range1, true), expect,
        `${r0} <~> ${r1} objects loose`)
      a.equal(intersects(range1, range0, true), expect,
        `${r1} <~> ${r0} objects loose`)
    })
  }
})

t.test('missing comparator parameter in intersect comparators', (t) => {
  a.throws(() => {
    new Comparator('>1.0.0').intersects()
  }, new TypeError('a Comparator is required'),
  'throws type error')
})
