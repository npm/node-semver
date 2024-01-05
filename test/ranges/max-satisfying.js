const t = require('node:test')
const a = require('node:assert')

const maxSatisfying = require('../../ranges/max-satisfying')

t.test('max satisfying', (t) => {
  const ranges = [
    [['1.2.3', '1.2.4'], '1.2', '1.2.4'],
    [['1.2.4', '1.2.3'], '1.2', '1.2.4'],
    [['1.2.3', '1.2.4', '1.2.5', '1.2.6'], '~1.2.3', '1.2.6'],
    [['1.1.0', '1.2.0', '1.2.1', '1.3.0', '2.0.0b1', '2.0.0b2',
      '2.0.0b3', '2.0.0', '2.1.0'], '~2.0.0', '2.0.0', true],
  ]
  for (const [versions, range, expect, loose] of ranges) {
    const actual = maxSatisfying(versions, range, loose)
    a.equal(actual, expect)
  }
})

t.test('bad ranges in max satisfying', (t) => {
  const r = 'some frogs and sneks-v2.5.6'
  a.equal(maxSatisfying([], r), null)
})
