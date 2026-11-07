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

test('sorts in place, stable, and keeps SemVer instances', (t) => {
  const v2 = new SemVer('2.0.0')
  const list = ['v1.2.3', v2, '1.2.3', '1.0.0', ' 1.2.3 ', '1.2.3']
  const result = rsort(list)
  t.equal(result, list)
  t.same(result, [v2, 'v1.2.3', '1.2.3', ' 1.2.3 ', '1.2.3', '1.0.0'])
  t.equal(result[0], v2)
  t.end()
})

test('loose option', (t) => {
  t.same(rsort(['01.2.3', '1.02.0', '0.1.2'], true), ['01.2.3', '1.02.0', '0.1.2'])
  t.throws(() => rsort(['01.2.3', '1.0.0']), TypeError)
  t.end()
})
