'use strict'

const { test } = require('tap')
const intersects = require('../../ranges/intersects')
const satisfies = require('../../functions/satisfies')
const Range = require('../../classes/range')
const Comparator = require('../../classes/comparator')
const comparatorIntersection = require('../fixtures/comparator-intersection.js')
const rangeIntersection = require('../fixtures/range-intersection.js')

test('intersect comparators', t => {
  t.plan(comparatorIntersection.length)
  comparatorIntersection.forEach(([c0, c1, expect, includePrerelease]) =>
    t.test(`${c0} ${c1} ${expect}`, t => {
      const opts = { loose: false, includePrerelease }
      const comp0 = new Comparator(c0)
      const comp1 = new Comparator(c1)

      t.equal(intersects(comp0, comp1, opts), expect, `${c0} intersects ${c1} objects`)
      t.equal(intersects(comp1, comp0, opts), expect, `${c1} intersects ${c0} objects`)
      t.equal(intersects(c0, c1, opts), expect, `${c0} intersects ${c1}`)
      t.equal(intersects(c1, c0, opts), expect, `${c1} intersects ${c0}`)

      opts.loose = true
      t.equal(intersects(comp0, comp1, opts), expect, `${c0} intersects ${c1} loose, objects`)
      t.equal(intersects(comp1, comp0, opts), expect, `${c1} intersects ${c0} loose, objects`)
      t.equal(intersects(c0, c1, opts), expect, `${c0} intersects ${c1} loose`)
      t.equal(intersects(c1, c0, opts), expect, `${c1} intersects ${c0} loose`)
      t.end()
    }))
})

test('ranges intersect', (t) => {
  rangeIntersection.forEach(([r0, r1, expect]) => {
    t.test(`${r0} <~> ${r1}`, t => {
      const range0 = new Range(r0)
      const range1 = new Range(r1)

      t.equal(intersects(r1, r0), expect, `${r0} <~> ${r1}`)
      t.equal(intersects(r0, r1), expect, `${r1} <~> ${r0}`)
      t.equal(intersects(r1, r0, true), expect, `${r0} <~> ${r1} loose`)
      t.equal(intersects(r0, r1, true), expect, `${r1} <~> ${r0} loose`)
      t.equal(intersects(range0, range1), expect, `${r0} <~> ${r1} objects`)
      t.equal(intersects(range1, range0), expect, `${r1} <~> ${r0} objects`)
      t.equal(intersects(range0, range1, true), expect,
        `${r0} <~> ${r1} objects loose`)
      t.equal(intersects(range1, range0, true), expect,
        `${r1} <~> ${r0} objects loose`)
      t.end()
    })
  })
  t.end()
})

test('missing comparator parameter in intersect comparators', (t) => {
  t.throws(() => {
    new Comparator('>1.0.0').intersects()
  }, new TypeError('a Comparator is required'),
  'throws type error')
  t.end()
})

// Differential oracle: if a concrete version satisfies BOTH ranges, then the
// ranges MUST intersect. This densely samples the near-zero / prerelease space
// where `<0.0.0-<id>` comparators live, guarding against the over-broad
// `startsWith('<0.0.0')` empty-range check that wrongly treated e.g.
// `<0.0.0-rc.1` (which matches `0.0.0-0`, `0.0.0-alpha`, ...) as matching
// nothing, producing false negatives from `intersects`.
test('intersects agrees with pointwise satisfaction', t => {
  const nums = [0, 1, 2]
  const pres = ['', '-0', '-alpha', '-alpha.0', '-alpha.1', '-beta', '-rc.1', '-rc.2']
  const grid = []
  for (const a of nums) {
    for (const b of nums) {
      for (const c of nums) {
        for (const p of pres) {
          grid.push(`${a}.${b}.${c}${p}`)
        }
      }
    }
  }

  const anchors = ['0.0.0', '0.0.0-0', '0.0.0-alpha', '0.0.0-rc.1',
    '0.1.0-alpha', '1.0.0-alpha', '1.0.0']
  const comparators = []
  for (const op of ['<', '<=', '>', '>=', '']) {
    for (const v of anchors) {
      comparators.push(`${op}${v}`)
    }
  }

  let witnessBacked = 0
  for (const opts of [{}, { includePrerelease: true }]) {
    for (const a of comparators) {
      for (const b of comparators) {
        const witness = grid.find(v => satisfies(v, a, opts) && satisfies(v, b, opts))
        if (witness === undefined) {
          continue
        }
        witnessBacked++
        const label = `${JSON.stringify(opts)}: ${witness} satisfies both`
        t.equal(intersects(a, b, opts), true, `${a} ∩ ${b} (${label})`)
        t.equal(intersects(b, a, opts), true, `${b} ∩ ${a} symmetry (${label})`)
      }
    }
  }
  t.ok(witnessBacked > 100, `exercised ${witnessBacked} witness-backed pairs`)
  t.end()
})
