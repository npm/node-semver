'use strict'

const { test } = require('tap')
const LRUCache = require('../../internal/lrucache')

test('basic cache operation', t => {
  const c = new LRUCache()
  const max = 1000

  for (let i = 0; i < max; i++) {
    t.equal(c.set(i, i), c)
  }
  for (let i = 0; i < max; i++) {
    t.equal(c.get(i), i)
  }
  c.set(1001, 1001)
  // lru item should be gone
  t.equal(c.get(0), undefined)
  c.set(42, undefined)
  t.end()
})
