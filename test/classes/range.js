'use strict'

const { test } = require('node:test')
const a = require('node:assert')
const Range = require('../../classes/range')
const Comparator = require('../../classes/comparator')
const rangeIntersection = require('../fixtures/range-intersection.js')

const rangeInclude = require('../fixtures/range-include.js')
const rangeExclude = require('../fixtures/range-exclude.js')
const rangeParse = require('../fixtures/range-parse.js')

test('range tests', () => {
  for (const [range, ver, options] of rangeInclude) {
    const r = new Range(range, options)
    a.ok(r.test(ver), `${range} satisfied by ${ver}`)
  }
})

test('range parsing', async (t) => {
  for (const [range, expect, options] of rangeParse) {
    await t.test(`${range} ${expect} ${JSON.stringify(options)}`, () => {
      if (expect === null) {
        a.throws(() => new Range(range, options), TypeError, `invalid range: ${range}`)
      } else {
        a.equal(new Range(range, options).range || '*', expect, `${range} => ${expect}`)
        a.equal(new Range(range, options).range, new Range(expect).range,
          'parsing both yields same result')
      }
    })
  }
})

test('throw for empty comparator set, even in loose mode', () => {
  a.throws(() => new Range('sadf||asdf', { loose: true }),
    TypeError('Invalid SemVer Range: sadf||asdf'))
})

test('convert comparator to range', () => {
  const c = new Comparator('>=1.2.3')
  const r = new Range(c)
  a.equal(r.raw, c.value, 'created range from comparator')
})

test('range as argument to range ctor', () => {
  const loose = new Range('1.2.3', { loose: true })
  a.equal(new Range(loose, { loose: true }), loose, 'loose option')
  a.equal(new Range(loose, true), loose, 'loose boolean')
  a.notEqual(new Range(loose), loose, 'created new range if not matched')

  const incPre = new Range('1.2.3', { includePrerelease: true })
  a.equal(new Range(incPre, { includePrerelease: true }), incPre,
    'include prerelease, option match returns argument')
  a.notEqual(new Range(incPre), incPre,
    'include prerelease, option mismatch does not return argument')
})

test('negative range tests', () => {
  for (const [range, ver, options] of rangeExclude) {
    const r = new Range(range, options)
    a.ok(!r.test(ver), `${range} not satisfied by ${ver}`)
  }
})

test('strict vs loose ranges', () => {
  [
    ['>=01.02.03', '>=1.2.3'],
    ['~1.02.03beta', '>=1.2.3-beta <1.3.0-0'],
  ].forEach(([loose, comps]) => {
    a.throws(() => new Range(loose))
    a.equal(new Range(loose, true).range, comps)
  })
})

test('tostrings', () => {
  a.equal(new Range('>= v1.2.3').toString(), '>=1.2.3')
})

test('formatted value is calculated lazily and cached', () => {
  const r = new Range('>= v1.2.3')
  a.equal(r.formatted, undefined)
  a.equal(r.format(), '>=1.2.3')
  a.equal(r.formatted, '>=1.2.3')
  a.equal(r.format(), '>=1.2.3')
})

test('ranges intersect', async (t) => {
  for (const [r0, r1, expect] of rangeIntersection) {
    await t.test(`${r0} <~> ${r1}`, () => {
      const range0 = new Range(r0)
      const range1 = new Range(r1)

      a.equal(range0.intersects(range1), expect,
        `${r0} <~> ${r1} objects`)
      a.equal(range1.intersects(range0), expect,
        `${r1} <~> ${r0} objects`)
    })
  }
})

test('missing range parameter in range intersect', () => {
  a.throws(() => {
    new Range('1.0.0').intersects()
  }, new TypeError('a Range is required'),
  'throws type error')
})

test('cache', () => {
  const cached = Symbol('cached')
  const r1 = new Range('1.0.0')
  r1.set[0][cached] = true
  const r2 = new Range('1.0.0')
  a.equal(r1.set[0][cached], true)
  a.equal(r2.set[0][cached], true) // Will be true, showing it's cached.
})
