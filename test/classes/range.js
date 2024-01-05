const t = require('node:test')
const a = require('node:assert')
const Range = require('../../classes/range')
const Comparator = require('../../classes/comparator')
const rangeIntersection = require('../fixtures/range-intersection.js')

const rangeInclude = require('../fixtures/range-include.js')
const rangeExclude = require('../fixtures/range-exclude.js')
const rangeParse = require('../fixtures/range-parse.js')
const rangeLoose = require('../fixtures/range-loose.js')

t.test('range tests', t => {
  for (const [range, ver, options] of rangeInclude) {
    const r = new Range(range, options)
    a.ok(r.test(ver), `${range} satisfied by ${ver}`)
  }
})

t.test('range parsing', async t => {
  for (const [range, expect, options] of rangeParse) {
    await t.test(`${range} ${expect} ${JSON.stringify(options)}`, t => {
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

t.test('throw for empty comparator set, even in loose mode', t => {
  a.throws(() => new Range('sadf||asdf', { loose: true }),
    TypeError('Invalid SemVer Range: sadf||asdf'))
})

t.test('convert comparator to range', t => {
  const c = new Comparator('>=1.2.3')
  const r = new Range(c)
  a.equal(r.raw, c.value, 'created range from comparator')
})

t.test('range as argument to range ctor', t => {
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

t.test('negative range tests', t => {
  for (const [range, ver, options] of rangeExclude) {
    const r = new Range(range, options)
    a.ok(!r.test(ver), `${range} not satisfied by ${ver}`)
  }
})

t.test('strict vs loose ranges', (t) => {
  for (const [loose, comps] of rangeLoose) {
    a.throws(() => new Range(loose))
    a.equal(new Range(loose, true).range, comps)
  }
})

t.test('tostrings', (t) => {
  a.equal(new Range('>= v1.2.3').toString(), '>=1.2.3')
})

t.test('ranges intersect', async (t) => {
  for (const [r0, r1, expect] of rangeIntersection) {
    await t.test(`${r0} <~> ${r1}`, t => {
      const range0 = new Range(r0)
      const range1 = new Range(r1)

      a.equal(range0.intersects(range1), expect,
        `${r0} <~> ${r1} objects`)
      a.equal(range1.intersects(range0), expect,
        `${r1} <~> ${r0} objects`)
    })
  }
})

t.test('missing range parameter in range intersect', (t) => {
  a.throws(() => {
    new Range('1.0.0').intersects()
  }, new TypeError('a Range is required'),
  'throws type error')
})
