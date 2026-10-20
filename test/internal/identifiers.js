'use strict'

const { test } = require('tap')
const { compareIdentifiers, rcompareIdentifiers } = require('../../internal/identifiers')

test('rcompareIdentifiers and compareIdentifiers', (t) => {
  const set = [
    ['1', '2'],
    ['alpha', 'beta'],
    ['0', 'beta'],
    [1, 2],
  ]
  set.forEach((ab) => {
    const a = ab[0]
    const b = ab[1]
    t.equal(compareIdentifiers(a, b), -1)
    t.equal(rcompareIdentifiers(a, b), 1)
  })
  t.equal(compareIdentifiers('0', '0'), 0)
  t.equal(rcompareIdentifiers('0', '0'), 0)
  t.equal(compareIdentifiers(1, 1), 0)
  t.equal(rcompareIdentifiers(1, 1), 0)
  t.end()
})

test('compareIdentifiers with numeric ids beyond MAX_SAFE_INTEGER', (t) => {
  // these arrive as strings because classes/semver.js keeps numeric
  // prerelease ids >= MAX_SAFE_INTEGER as strings to avoid precision loss.
  // Number coercion collapses 2^53 and 2^53+1 to the same double, so they
  // must be compared as full-precision integers.
  t.equal(compareIdentifiers('9007199254740992', '9007199254740993'), -1)
  t.equal(rcompareIdentifiers('9007199254740992', '9007199254740993'), 1)
  t.equal(compareIdentifiers('9007199254740993', '9007199254740992'), 1)
  t.equal(compareIdentifiers('9007199254740992', '9007199254740992'), 0)
  t.end()
})
