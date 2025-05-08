'use strict'

const { test } = require('tap')
const sort = require('../../functions/sort')

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
