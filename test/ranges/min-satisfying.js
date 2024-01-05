const t = require('node:test')
const a = require('node:assert')

const minSatisfying = require('../../ranges/min-satisfying')

t.test('min satisfying', (t) => {
  const ranges = [
    [['1.2.3', '1.2.4'], '1.2', '1.2.3'],
    [['1.2.4', '1.2.3'], '1.2', '1.2.3'],
    [['1.2.3', '1.2.4', '1.2.5', '1.2.6'], '~1.2.3', '1.2.3'],
    [['1.1.0', '1.2.0', '1.2.1', '1.3.0', '2.0.0b1', '2.0.0b2',
      '2.0.0b3', '2.0.0', '2.1.0'], '~2.0.0', '2.0.0', true],
  ]
  for (const [versions, range, expect, loose] of ranges) {
    const actual = minSatisfying(versions, range, loose)
    a.equal(actual, expect)
  }
})

t.test('bad ranges in min satisfying', (t) => {
  const r = 'some frogs and sneks-v2.5.6'
  a.equal(minSatisfying([], r), null)
})
