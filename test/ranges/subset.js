'use strict'

const t = require('tap')
const subset = require('../../ranges/subset.js')
const satisfies = require('../../functions/satisfies.js')
const Range = require('../../classes/range')

// sub, dom, expect, [options]
const cases = [
  ['1.2.3', '1.2.3', true],
  ['1.2.3', '1.x', true],
  ['1.2.3 1.2.4', '1.2.3', true],
  ['1.2.3 1.2.4', '1.2.9', true], // null set is subset of everything
  ['1.2.3', '>1.2.0', true],
  ['1.2.3 2.3.4 || 2.3.4', '3', false],
  ['^1.2.3-pre.0', '1.x', false],
  // a prerelease `=` comparator combined with a bound of a different tuple must
  // not be treated as a null set (subset false-positive): 1.1.2-alpha is in sub
  // but not in dom, so sub is not a subset of dom
  ['=1.1.2-alpha <3.1.0', '<1.0.0', false],
  ['<3.1.0-0 1.1.2-alpha', '~2.0', false],
  ['^1.2.3-pre.0', '1.x', true, { includePrerelease: true }],
  ['>2 <1', '3', true],
  ['1 || 2 || 3', '>=1.0.0', true],

  // everything is a subset of *
  ['1.2.3', '*', true],
  ['^1.2.3', '*', true],
  ['^1.2.3-pre.0', '*', false],
  ['^1.2.3-pre.0', '*', true, { includePrerelease: true }],
  ['1 || 2 || 3', '*', true],

  // prerelease edge cases
  ['^1.2.3-pre.0', '>=1.0.0', false],
  ['^1.2.3-pre.0', '>=1.0.0', true, { includePrerelease: true }],
  ['^1.2.3-pre.0', '>=1.2.3-pre.0', true],
  ['^1.2.3-pre.0', '>=1.2.3-pre.0', true, { includePrerelease: true }],
  ['^10.2.0-beta.2', '^10.2.0-beta.1', true],
  ['>1.2.3-pre.0', '>=1.2.3-pre.0', true],
  ['>1.2.3-pre.0', '>1.2.3-pre.0 || 2', true],
  ['1 >1.2.3-pre.0', '>1.2.3-pre.0', true],
  ['1 <=1.2.3-pre.0', '>=1.0.0-0', false],
  ['1 <=1.2.3-pre.0', '>=1.0.0-0', true, { includePrerelease: true }],
  ['1 <=1.2.3-pre.0', '<=1.2.3-pre.0', true],
  ['1 <=1.2.3-pre.0', '<=1.2.3-pre.0', true, { includePrerelease: true }],
  ['<1.2.3-pre.0', '<=1.2.3-pre.0', true],
  ['<1.2.3-pre.0', '<1.2.3-pre.0 || 2', true],
  ['1 <1.2.3-pre.0', '<1.2.3-pre.0', true],

  ['*', '*', true],
  ['', '*', true],
  ['*', '', true],
  ['', '', true],

  // >=0.0.0 is like * in non-prerelease mode
  // >=0.0.0-0 is like * in prerelease mode
  ['*', '>=0.0.0-0', true, { includePrerelease: true }],

  // true because these are identical in non-PR mode
  ['*', '>=0.0.0', true],

  // false because * includes 0.0.0-0 in PR mode
  ['*', '>=0.0.0', false, { includePrerelease: true }],

  // true because * doesn't include 0.0.0-0 in non-PR mode
  ['*', '>=0.0.0-0', true],

  ['^2 || ^3 || ^4', '>=1', true],
  ['^2 || ^3 || ^4', '>1', true],
  ['^2 || ^3 || ^4', '>=2', true],
  ['^2 || ^3 || ^4', '>=3', false],
  ['>=1', '^2 || ^3 || ^4', false],
  ['>1', '^2 || ^3 || ^4', false],
  ['>=2', '^2 || ^3 || ^4', false],
  ['>=3', '^2 || ^3 || ^4', false],
  ['^1', '^2 || ^3 || ^4', false],
  ['^2', '^2 || ^3 || ^4', true],
  ['^3', '^2 || ^3 || ^4', true],
  ['^4', '^2 || ^3 || ^4', true],
  ['1.x', '^2 || ^3 || ^4', false],
  ['2.x', '^2 || ^3 || ^4', true],
  ['3.x', '^2 || ^3 || ^4', true],
  ['4.x', '^2 || ^3 || ^4', true],

  ['>=1.0.0 <=1.0.0 || 2.0.0', '1.0.0 || 2.0.0', true],
  ['<=1.0.0 >=1.0.0 || 2.0.0', '1.0.0 || 2.0.0', true],
  ['>=1.0.0', '1.0.0', false],
  ['>=1.0.0 <2.0.0', '<2.0.0', true],
  ['>=1.0.0 <2.0.0', '>0.0.0', true],
  ['>=1.0.0 <=1.0.0', '1.0.0', true],
  ['>=1.0.0 <=1.0.0', '2.0.0', false],
  ['<2.0.0', '>=1.0.0 <2.0.0', false],
  ['>=1.0.0', '>=1.0.0 <2.0.0', false],
  ['>=1.0.0 <2.0.0', '<2.0.0', true],
  ['>=1.0.0 <2.0.0', '>=1.0.0', true],
  ['>=1.0.0 <2.0.0', '>1.0.0', false],
  ['>=1.0.0 <=2.0.0', '<2.0.0', false],
  ['>=1.0.0', '<1.0.0', false],
  ['<=1.0.0', '>1.0.0', false],
  ['<=1.0.0 >1.0.0', '>1.0.0', true],
  ['1.0.0 >1.0.0', '>1.0.0', true],
  ['1.0.0 <1.0.0', '>1.0.0', true],
  ['<1 <2 <3', '<4', true],
  ['<3 <2 <1', '<4', true],
  ['>1 >2 >3', '>0', true],
  ['>3 >2 >1', '>0', true],
  ['<=1 <=2 <=3', '<4', true],
  ['<=3 <=2 <=1', '<4', true],
  ['>=1 >=2 >=3', '>0', true],
  ['>=3 >=2 >=1', '>0', true],
  ['>=3 >=2 >=1', '>=3 >=2 >=1', true],
  ['>2.0.0', '>=2.0.0', true],
]

t.plan(cases.length + 2)
cases.forEach(([sub, dom, expect, options]) => {
  const msg = `${sub || "''"} ⊂ ${dom || "''"} = ${expect}` +
    (options ? ' ' + Object.keys(options).join(',') : '')
  t.equal(subset(sub, dom, options), expect, msg)
})

t.test('range should be subset of itself in obj or string mode', t => {
  const range = '^1'
  t.equal(subset(range, range), true)
  t.equal(subset(range, new Range(range)), true)
  t.equal(subset(new Range(range), range), true)
  t.equal(subset(new Range(range), new Range(range)), true)

  // test with using the same actual object
  const r = new Range(range)
  t.equal(subset(r, r), true)

  // different range object with same set array
  const r2 = new Range(range)
  r2.set = r.set
  t.equal(subset(r2, r), true)
  t.equal(subset(r, r2), true)

  // different range with set with same simple set arrays
  const r3 = new Range(range)
  r3.set = [...r.set]
  t.equal(subset(r3, r), true)
  t.equal(subset(r, r3), true)

  // different range with set with simple sets with same comp objects
  const r4 = new Range(range)
  r4.set = r.set.map(s => [...s])
  t.equal(subset(r4, r), true)
  t.equal(subset(r, r4), true)
  t.end()
})

// Property: a true subset(a, b) must never admit a version that satisfies a but
// not b. The table cases above cannot catch this class - the suite is green with
// and without the fix - so assert the invariant over generated ranges, in the
// false-positive direction only (a finite universe cannot refute a `false`).
// Independently rediscovered and proposed by @mrvonkalus (differential fuzzing).
t.test('a true subset() result never admits a version outside the superset', t => {
  // seeded xorshift32, so any failure reproduces exactly and CI cannot flake
  let seed = 0x1a2b3c4d
  const rand = () => {
    seed ^= seed << 13
    seed ^= seed >>> 17
    seed ^= seed << 5
    return (seed >>> 0) / 0x100000000
  }
  const pick = arr => arr[Math.floor(rand() * arr.length)]

  const universe = []
  for (const major of [0, 1, 2, 3]) {
    for (const minor of [0, 1, 2]) {
      for (const patch of [0, 1, 2]) {
        universe.push(`${major}.${minor}.${patch}`)
        for (const pre of ['alpha.0', 'alpha.1', 'beta', '0']) {
          universe.push(`${major}.${minor}.${patch}-${pre}`)
        }
      }
    }
  }

  const ops = ['>', '>=', '<', '<=']
  const simple = () => {
    const parts = []
    for (let i = 1 + Math.floor(rand() * 3); i > 0; i--) {
      parts.push(rand() < 0.5 ? `${pick(ops)}${pick(universe)}` : pick(universe))
    }
    return parts.join(' ')
  }
  const range = () => {
    const parts = []
    for (let i = 1 + Math.floor(rand() * 2); i > 0; i--) {
      parts.push(simple())
    }
    return parts.join(' || ')
  }

  let unsound = null
  for (let i = 0; i < 10000 && !unsound; i++) {
    const options = rand() < 0.5 ? {} : { includePrerelease: true }
    const a = range()
    const b = range()
    if (!subset(a, b, options)) {
      continue
    }
    for (const v of universe) {
      if (satisfies(v, a, options) && !satisfies(v, b, options)) {
        unsound = `subset(${JSON.stringify(a)}, ${JSON.stringify(b)}, ${
          JSON.stringify(options)}) === true, but ${v} satisfies the sub-range and not the super-range`
        break
      }
    }
  }

  t.equal(unsound, null, 'no unsound subset() result over generated ranges')
  t.end()
})
