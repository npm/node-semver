'use strict'

const { test } = require('tap')
const rsort = require('../../functions/rsort')
const SemVer = require('../../classes/semver')

test('sorting', (t) => {
  const list = [
    '1.2.3+1',
    '1.2.3+0',
    '1.2.3',
    '5.9.6',
    '0.1.2',
  ]
  const rsorted = [
    '5.9.6',
    '1.2.3+1',
    '1.2.3+0',
    '1.2.3',
    '0.1.2',
  ]
  t.same(rsort(list), rsorted)
  t.end()
})

test('rsort preserves build order on version objects with different options', t => {
  const higher = new SemVer('1.0.0+2', { loose: true })
  const lower = new SemVer('1.0.0+1', { includePrerelease: true })
  t.strictSame(rsort([lower, higher]), [higher, lower])
  t.end()
})
