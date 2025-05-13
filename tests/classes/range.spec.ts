import { test } from '@japa/runner'
import Range from '../../src/classes/range.js'
import Comparator from '../../src/classes/comparator.js'
import rangeIntersection from '../fixtures/range-intersection.js'
import rangeInclude from '../fixtures/range-include.js'
import rangeExclude from '../fixtures/range-exclude.js'
import rangeParse from '../fixtures/range-parse.js'

test('range tests')
  .with(rangeInclude)
  .run(({ assert }, [range, ver, options]) => {
    const r = new Range(range, options)
    assert.ok(r.test(ver), `${range} satisfied by ${ver}`)
  })

test('range parsing')
  .with(rangeParse)
  .run(({ assert }, [range, expect, options]) => {
    if (expect === null) {
      assert.throws(() => new Range(range, options), TypeError)
    } else {
      assert.equal(new Range(range, options).range || '*', expect, `${range} => ${expect}`)
      assert.equal(new Range(range, options).range, new Range(expect).range, 'parsing both yields same result')
    }
  })

test('throw for empty comparator set, even in loose mode', ({ assert }) => {
  assert.throws(() => new Range('sadf||asdf', { loose: true }), TypeError, 'Invalid SemVer Range: sadf||asdf')
})

test('convert comparator to range', ({ assert }) => {
  const c = new Comparator('>=1.2.3')
  const r = new Range(c)
  assert.equal(r.raw, c.value, 'created range from comparator')
})

test('range as argument to range ctor', ({ assert }) => {
  const loose = new Range('1.2.3', { loose: true })
  assert.deepEqual(new Range(loose, { loose: true }), loose, 'loose option')
  assert.deepEqual(new Range(loose, true), loose, 'loose boolean')
  assert.notDeepEqual(new Range(loose), loose, 'created new range if not matched')

  const incPre = new Range('1.2.3', { includePrerelease: true })
  assert.deepEqual(
    new Range(incPre, { includePrerelease: true }),
    incPre,
    'include prerelease, option match returns argument'
  )
  assert.notDeepEqual(new Range(incPre), incPre, 'include prerelease, option mismatch does not return argument')
})

test('negative range tests')
  .with(rangeExclude)
  .run(({ assert }, [range, ver, options]) => {
    const r = new Range(range, options)
    assert.isFalse(r.test(ver), `${range} satisfied by ${ver}`)
  })

test('strict vs loose ranges')
  .with([
    ['>=01.02.03', '>=1.2.3'],
    ['~1.02.03beta', '>=1.2.3-beta <1.3.0-0'],
  ])
  .run(({ assert }, [loose, comps]) => {
    assert.throws(() => new Range(loose))
    assert.equal(new Range(loose, true).range, comps)
  })

test('toStrings', ({ assert }) => {
  assert.equal(new Range('>= v1.2.3').toString(), '>=1.2.3')
})

test('formatted value is calculated lazily and cached', ({ assert }) => {
  const r = new Range('>= v1.2.3')
  assert.isUndefined(r.formatted)
  assert.equal(r.format(), '>=1.2.3')
  assert.equal(r.formatted, '>=1.2.3')
  assert.equal(r.format(), '>=1.2.3')
})

test('ranges intersect')
  .with(rangeIntersection)
  .run(({ assert }, [r0, r1, expect]) => {
    const range0 = new Range(r0)
    const range1 = new Range(r1)

    assert.equal(range0.intersects(range1), expect, `${r0} <~> ${r1} objects`)
    assert.equal(range1.intersects(range0), expect, `${r1} <~> ${r0} objects`)
  })

test('missing range parameter in range intersect', ({ assert }) => {
  assert.throws(
    () => {
      // @ts-expect-error For testing purposes
      new Range('1.0.0').intersects()
    },
    TypeError,
    'a Range is required'
  )
})

test('cache', ({ assert }) => {
  const cached = Symbol('cached')
  const r1 = new Range('1.0.0')
  // @ts-expect-error For testing purposes
  r1.set[0][cached] = true
  const r2 = new Range('1.0.0')
  // @ts-expect-error For testing purposes
  assert.isTrue(r1.set[0][cached])
  // @ts-expect-error For testing purposes
  assert.isTrue(r2.set[0][cached]) // Will be true, showing it's cached.
})
