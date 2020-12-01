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

  ['*', '*', true],
  ['', '*', true],
  ['*', '', true],
  ['', '', true],

  // >=0.0.0 is like * in non-prerelease mode
  // >=0.0.0-0 is like * in prerelease mode
  ['*', '>=0.0.0-0', true, { includePrerelease: true }],
  ['*', '>=0.0.0', true],
  ['*', '>=0.0.0', false, { includePrerelease: true }],
  ['*', '>=0.0.0-0', false],
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


t.plan(cases.length + 1)
cases.forEach(([sub, dom, expect, options = {}]) => {
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
