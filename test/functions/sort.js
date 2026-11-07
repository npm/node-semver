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

test('sorts in place, stable, and keeps SemVer instances', (t) => {
  const v2 = new SemVer('2.0.0')
  const list = ['v1.2.3', v2, '1.2.3', '1.0.0', ' 1.2.3 ', '1.2.3']
  const result = sort(list)
  t.equal(result, list)
  t.same(result, ['1.0.0', 'v1.2.3', '1.2.3', ' 1.2.3 ', '1.2.3', v2])
  t.equal(result[5], v2)
  t.end()
})

test('loose option', (t) => {
  t.same(sort(['01.2.3', '1.02.0', '0.1.2'], true), ['0.1.2', '1.02.0', '01.2.3'])
  t.throws(() => sort(['01.2.3', '1.0.0']), TypeError)
  t.end()
})
