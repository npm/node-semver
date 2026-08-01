'use strict'

const t = require('tap')
const subset = require('../../ranges/subset.js')
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

  // Union subset: sub spans multiple dom OR-branches (#703)
  ['>=17.2.0', '^17.2.0 || >17', true],
  ['>=17.2.0', '^17.2.0 || >=18', true],
  ['>=2.0.0', '^2 || ^3 || ^4 || >=5', true],
  ['>=2.0.0', '^2 || >=3', true],
  ['>=2.0.0 <5.0.0', '^2 || ^3 || ^4', true],

  // Union subset with gap → false
  ['>=2.0.0', '^2 || ^4', false],
  ['>=2.0.0 <6.0.0', '^2 || ^4 || ^5', false],

  // Union: sub unbounded above, dom union unbounded
  ['>=1.0.0', '^1 || >=2.0.0', true],

  // Union: sub bounded, dom union overlapping
  ['>=1.0.0 <4.0.0', '^1 || ^2 || ^3', true],

  // Union: dom branches overlap
  ['>=1.0.0 <3.0.0', '>=1.0.0 <2.5.0 || >=2.0.0 <3.0.0', true],

  // Union: eq-pinned sub in union dom
  ['2.0.0', '^1 || ^2', true],

  // Union: eq-pinned sub NOT in any dom branch
  ['5.0.0', '^1 || ^2', false],

  // Union: single dom branch (no union benefit)
  ['>=1.0.0', '^1', false],

  // Union: * dom with sub
  ['>=1.0.0', '^1 || *', true],

  // Union: sub has prerelease in non-prerelease mode → no union fallback
  ['^1.2.3-pre.0', '^1 || ^2', false],

  // Union: sub with lt prerelease -0 (equivalent to plain lt)
  ['>=1.0.0 <2.0.0-0', '^1 || ^2', true],

  // Union: includePrerelease mode — gap at 2.0.0 prereleases
  ['>=1.0.0', '^1 || >=2.0.0', false, { includePrerelease: true }],
  // Union: includePrerelease mode — contiguous
  ['>=1.0.0', '^1 || >=2.0.0-0', true, { includePrerelease: true }],

  // Union: null-set dom branches are skipped
  ['>=2.0.0', '>5.0.0 <3.0.0 || >=1.0.0', true],

  // Union: sub is null set → subset of everything
  ['>=5.0.0 <3.0.0', '^1 || ^2', true],

  // Union: dom has <= and >= that bridge
  ['>=1.0.0 <=3.0.0', '>=1.0.0 <=2.0.0 || >=2.0.0 <=3.0.0', true],

  // Union: sub gt prerelease in non-prerelease mode → no union
  ['>=1.0.0-beta', '^1 || >=2.0.0', false],

  // Union: sub lt prerelease (non -0) in non-prerelease mode → no union
  ['>=1.0.0 <2.0.0-beta', '^1 || ^2', false],

  // Union: dom overlapping intervals
  ['>=1.0.0 <5.0.0', '>=1.0.0 <3.0.0 || >=2.0.0 <5.0.0', true],

  // Union: dom intervals in wrong order get sorted
  ['>=1.0.0', '>=3.0.0 || ^1 || ^2', true],

  // Union: > and >= at same version sort correctly
  ['>=1.0.0 <=3.0.0', '>1.0.0 <3.0.0-0 || >=3.0.0 <=3.0.0', false],

  // Union: eq-pinned sub cannot match via union if simpleSubset failed
  ['3.0.0', '^2 || ^4', false],

  // Union: all dom branches are null sets
  ['>=1.0.0', '>5.0.0 <3.0.0 || >8.0.0 <6.0.0', false],

  // Union: dom intervals with <= upper bounds
  ['>=1.0.0 <=3.0.0', '>=1.0.0 <=2.0.0 || >2.0.0 <=3.0.0', true],

  // Union: eq-pinned sub, not satisfying dom
  ['1.5.0', '>2.0.0 || >5.0.0', false],

  // Union: sub null set with eq+gt inconsistency
  ['5.0.0 >6.0.0', '^1 || ^2', true],

  // Union: sub with lt that is <= vs dom lt that is <
  ['>=1.0.0 <=3.0.0', '^1 || >=2.0.0 <3.0.0', false],

  // Union: final coverage check at end of sweep
  ['>=1.0.0 <4.0.0', '^1 || ^2', false],

  // Union: dom with no lower bound (covers gtCovers null path)
  ['<4.0.0', '<3.0.0 || >=2.0.0', true],

  // Union: sub with no lower bound, dom intervals have lower bounds
  ['<4.0.0', '>=2.0.0 <3.0.0 || >=3.0.0', false],

  // Union: dom intervals with same lower bound version, different operators
  ['>=2.0.0 <4.0.0', '>=2.0.0 <3.0.0 || >2.0.0', true],

  // Union: coverage extension with <= at same version as current <
  ['>=1.0.0 <=3.0.0', '>=1.0.0 <3.0.0 || >=2.0.0 <=3.0.0', true],

  // Union: sub <=X not covered by dom <X
  ['>=1.0.0 <=3.0.0', '>=1.0.0 <3.0.0-0 || >=4.0.0', false],

  // Union: sub unbounded, dom first interval covers lower
  ['>=1.0.0', '<3.0.0 || >=2.0.0', true],

  // Union: two dom intervals with no lower bound (covers compareBound both-null)
  ['<6.0.0', '<3.0.0 || <5.0.0', false],

  // Union: dom set with eq comparator (skipped as point interval)
  ['>=1.0.0 <5.0.0', '^1 || 3.0.0 || ^4', false],

  // Union: dom set with gt=lt=0 inconsistency (cmp=0, wrong operators)
  ['>=1.0.0', '>2.0.0 <=2.0.0 || >=1.0.0', true],

  // Union: isAdjacentPrerelease called in includePrerelease mode
  ['>=1.0.0', '>=1.0.0 <2.0.0-0 || >=2.0.0', false, { includePrerelease: true }],

  // Union: sub gtCovers same version
  ['>=2.0.0', '>=2.0.0 <3.0.0-0 || >=3.0.0', true],

  // Union: * sub in includePrerelease mode (covers extractBounds ANY path)
  ['*', '^1 || ^2', false, { includePrerelease: true }],

  // Union: * sub in non-includePrerelease mode (0.x not covered)
  ['*', '^1 || >=2.0.0', false],

  // Union: dom with cmp===0 inconsistency (>X <=X is null set, gap remains)
  ['>=1.0.0', '>2.0.0 <=2.0.0 || ^1 || >=3.0.0', false],

  // Union: isAdjacentPrerelease in includePrerelease (should not bridge gap)
  ['>=1.0.0 <4.0.0', '>=1.0.0 <2.0.0-0 || >=2.0.0 <4.0.0', false, { includePrerelease: true }],

  // Union: gap at exact version with < and > operators
  ['>=1.0.0 <5.0.0', '>=1.0.0 <3.0.0 || >3.0.0 <5.0.0', false],

  // Union: dom coverage exceeds sub upper bound (ltCovers cmp < 0)
  ['>=1.0.0 <=3.0.0', '>=1.0.0 <=2.0.0 || >=2.0.0 <=4.0.0', true],

  // Union: sort with null-gt dom interval and non-null-gt dom interval
  ['<5.0.0', '<4.0.0 || >=3.0.0', true],
  // same but reversed dom order — forces sort to encounter null-gt
  ['<5.0.0', '>=3.0.0 || <4.0.0', true],
  // Union: two dom branches with identical lower bound triggers sort return-0
  ['>=2.0.0 <4.0.0', '>=2.0.0 <3.0.0 || >=2.0.0', true],
  // Union: sort tiebreaker where > must sort after >= at same version
  ['>2.0.0 <4.0.0', '>2.0.0 <3.0.0 || >=2.0.0', true],
  // Union: coverage extension with <= wider than < at same version
  ['>=1.0.0 <=3.0.0', '>=1.0.0 <3.0.0 || >=2.0.0 <=3.0.0', true],

  // Union: sort tiebreaker >= before > (reversed dom order)
  ['>=2.0.0 <4.0.0', '>2.0.0 || >=2.0.0 <3.0.0', true],
]

t.plan(cases.length + 1)
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
