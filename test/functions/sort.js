'use strict'

const { test } = require('tap')
const sort = require('../../functions/sort')
const SemVer = require('../../classes/semver')

test('sorting', (t) => {
  const list = [
    '1.2.3+1',
    '1.2.3+0',
    '1.2.3',
    '5.9.6',
    '0.1.2',
  ]
  const sorted = [
    '0.1.2',
    '1.2.3',
    '1.2.3+0',
    '1.2.3+1',
    '5.9.6',
  ]

  t.same(sort(list), sorted)
  t.end()
})

test('sort preserves build order on version objects with different options', t => {
  const higher = new SemVer('1.0.0+2', { loose: true })
  const lower = new SemVer('1.0.0+1', { includePrerelease: true })
  t.strictSame(sort([higher, lower]), [lower, higher])
  t.end()
})
