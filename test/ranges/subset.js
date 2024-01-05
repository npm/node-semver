const t = require('node:test')
const a = require('node:assert')

const subset = require('../../ranges/subset')
const Range = require('../../classes/range')

const cases = require('../fixtures/subset')

t.test('subset', t => {
  for (const [sub, sup, expect, options] of cases) {
    const msg = `${sub || "''"} ⊂ ${sup || "''"} = ${expect}` +
      (options ? ' ' + Object.keys(options).join(',') : '')
    a.equal(subset(sub, sup, options), expect, msg)
  }
})

t.test('range should be subset of itself in obj or string mode', t => {
  const range = '^1'
  a.equal(subset(range, range), true)
  a.equal(subset(range, new Range(range)), true)
  a.equal(subset(new Range(range), range), true)
  a.equal(subset(new Range(range), new Range(range)), true)

  // test with using the same actual object
  const r = new Range(range)
  a.equal(subset(r, r), true)

  // different range object with same set array
  const r2 = new Range(range)
  r2.set = r.set
  a.equal(subset(r2, r), true)
  a.equal(subset(r, r2), true)

  // different range with set with same simple set arrays
  const r3 = new Range(range)
  r3.set = [...r.set]
  a.equal(subset(r3, r), true)
  a.equal(subset(r, r3), true)

  // different range with set with simple sets with same comp objects
  const r4 = new Range(range)
  r4.set = r.set.map(s => [...s])
  a.equal(subset(r4, r), true)
  a.equal(subset(r, r4), true)
})
