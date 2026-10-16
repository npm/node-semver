'use strict'

const { test } = require('tap')
const Range = require('../../classes/range')
const Comparator = require('../../classes/comparator')
const rangeIntersection = require('../fixtures/range-intersection.js')

const rangeInclude = require('../fixtures/range-include.js')
const rangeExclude = require('../fixtures/range-exclude.js')
const rangeParse = require('../fixtures/range-parse.js')

test('range tests', t => {
  t.plan(rangeInclude.length)
  rangeInclude.forEach(([range, ver, options]) => {
    const r = new Range(range, options)
    t.ok(r.test(ver), `${range} satisfied by ${ver}`)
  })
})

test('range parsing', t => {
  const assertions = rangeParse.reduce((count, [, expect]) =>
    count + (expect === null ? 1 : 2), 0)
  t.plan(assertions)
  rangeParse.forEach(([range, expect, options]) => {
    const description = `${range} ${JSON.stringify(options)}`
    if (expect === null) {
      t.throws(() => new Range(range, options), TypeError, `invalid range: ${description}`)
    } else {
      const parsed = new Range(range, options)
      t.equal(parsed.range || '*', expect, `${description} => ${expect}`)
      t.equal(parsed.range,
        new Range(expect, { includePrerelease: parsed.includePrerelease }).range,
        `parsing both yields same result: ${description}`)
    }
  })
})

test('range parsing covers every option combination', t => {
  const inputsByOptions = new Map()
  for (const [range, , options] of rangeParse) {
    const loose = !!(options && options.loose)
    const includePrerelease = !!(options && options.includePrerelease)
    const key = `${loose}:${includePrerelease}`
    if (!inputsByOptions.has(key)) {
      inputsByOptions.set(key, [])
    }
    inputsByOptions.get(key).push(range)
  }

  const combinations = ['false:false', 'true:false', 'false:true', 'true:true']
  t.strictSame([...inputsByOptions.keys()], combinations, 'all four modes are present')
  const defaultInputs = inputsByOptions.get('false:false')
  t.equal(defaultInputs.length, 348, 'retains every source fixture row')
  t.equal(new Set(defaultInputs).size, 335, 'retains every distinct source input')
  for (const key of combinations.slice(1)) {
    t.strictSame(inputsByOptions.get(key), defaultInputs, `${key} covers the same inputs`)
  }
  t.end()
})

test('legacy range parsing options', t => {
  const cases = [
    ['>01.02.03', '>1.2.3', true],
    ['>01.02.03', null, false],
    ['>= 1.2.3', '>=1.2.3', null],
    ['1.2.3', '1.2.3', {}],
    ['1.2.3', '1.2.3', { loose: false }],
  ]
  t.plan(cases.length)
  for (const [range, expect, options] of cases) {
    if (expect === null) {
      t.throws(() => new Range(range, options), TypeError, 'strict boolean rejects leading zeros')
    } else {
      t.equal(new Range(range, options).range, expect, JSON.stringify(options))
    }
  }
})

test('throw for empty comparator set, even in loose mode', t => {
  t.throws(() => new Range('sadf||asdf', { loose: true }),
    TypeError('Invalid SemVer Range: sadf||asdf'))
  t.end()
})

test('convert comparator to range', t => {
  const c = new Comparator('>=1.2.3')
  const r = new Range(c)
  t.equal(r.raw, c.value, 'created range from comparator')
  t.end()
})

test('range as argument to range ctor', t => {
  const loose = new Range('1.2.3', { loose: true })
  t.equal(new Range(loose, { loose: true }), loose, 'loose option')
  t.equal(new Range(loose, true), loose, 'loose boolean')
  t.not(new Range(loose), loose, 'created new range if not matched')

  const incPre = new Range('1.2.3', { includePrerelease: true })
  t.equal(new Range(incPre, { includePrerelease: true }), incPre,
    'include prerelease, option match returns argument')
  t.not(new Range(incPre), incPre,
    'include prerelease, option mismatch does not return argument')

  t.end()
})

test('negative range tests', t => {
  t.plan(rangeExclude.length)
  rangeExclude.forEach(([range, ver, options]) => {
    const r = new Range(range, options)
    t.notOk(r.test(ver), `${range} not satisfied by ${ver}`)
  })
})

test('strict vs loose ranges', (t) => {
  [
    ['>=01.02.03', '>=1.2.3'],
    ['~1.02.03beta', '>=1.2.3-beta <1.3.0-0'],
  ].forEach(([loose, comps]) => {
    t.throws(() => new Range(loose))
    t.equal(new Range(loose, true).range, comps)
  })
  t.end()
})

test('tostrings', (t) => {
  t.equal(new Range('>= v1.2.3').toString(), '>=1.2.3')
  t.end()
})

test('formatted value is calculated lazily and cached', (t) => {
  const r = new Range('>= v1.2.3')
  t.equal(r.formatted, undefined)
  t.equal(r.format(), '>=1.2.3')
  t.equal(r.formatted, '>=1.2.3')
  t.equal(r.format(), '>=1.2.3')
  t.end()
})

test('ranges intersect', (t) => {
  rangeIntersection.forEach(([r0, r1, expect]) => {
    t.test(`${r0} <~> ${r1}`, t => {
      const range0 = new Range(r0)
      const range1 = new Range(r1)

      t.equal(range0.intersects(range1), expect,
        `${r0} <~> ${r1} objects`)
      t.equal(range1.intersects(range0), expect,
        `${r1} <~> ${r0} objects`)
      t.end()
    })
  })
  t.end()
})

test('missing range parameter in range intersect', (t) => {
  t.throws(() => {
    new Range('1.0.0').intersects()
  }, new TypeError('a Range is required'),
  'throws type error')
  t.end()
})

test('cache', (t) => {
  const cached = Symbol('cached')
  const r1 = new Range('1.0.0')
  r1.set[0][cached] = true
  const r2 = new Range('1.0.0')
  t.equal(r1.set[0][cached], true)
  t.equal(r2.set[0][cached], true) // Will be true, showing it's cached.
  t.end()
})
