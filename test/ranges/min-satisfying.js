'use strict'

const { test } = require('tap')
const minSatisfying = require('../../ranges/min-satisfying')

test('min satisfying', (t) => {
  [[['1.2.3', '1.2.4'], '1.2', '1.2.3'],
    [['1.2.4', '1.2.3'], '1.2', '1.2.3'],
    [['1.2.3', '1.2.4', '1.2.5', '1.2.6'], '~1.2.3', '1.2.3'],
    [['1.1.0', '1.2.0', '1.2.1', '1.3.0', '2.0.0b1', '2.0.0b2', '2.0.0b3', '2.0.0', '2.1.0'],
      '~2.0.0', '2.0.0', true],
  ].forEach((v) => {
    const versions = v[0]
    const range = v[1]
    const expect = v[2]
    const loose = v[3]
    const actual = minSatisfying(versions, range, loose)
    t.equal(actual, expect)
  })
  t.end()
})

test('bad ranges in min satisfying', (t) => {
  const r = 'some frogs and sneks-v2.5.6'
  t.equal(minSatisfying([], r), null)
  t.end()
})
