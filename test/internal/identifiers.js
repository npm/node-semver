'use strict'

const { test } = require('node:test')
const a = require('node:assert')
const { compareIdentifiers, rcompareIdentifiers } = require('../../internal/identifiers')

test('rcompareIdentifiers and compareIdentifiers', () => {
  const set = [
    ['1', '2'],
    ['alpha', 'beta'],
    ['0', 'beta'],
    [1, 2],
  ]
  set.forEach((ab) => {
    const a1 = ab[0]
    const b = ab[1]
    a.equal(compareIdentifiers(a1, b), -1)
    a.equal(rcompareIdentifiers(a1, b), 1)
  })
  a.equal(compareIdentifiers('0', '0'), 0)
  a.equal(rcompareIdentifiers('0', '0'), 0)
  a.equal(compareIdentifiers(1, 1), 0)
  a.equal(rcompareIdentifiers(1, 1), 0)
})
