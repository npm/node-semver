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

test('test setting the same key twice', t => {
  const c = new LRUCache()
  c.set(1, 1)
  c.set(1, 2)
  t.equal(c.get(1), 2)
  t.end()
})

test('test that setting an already cached key bumps it last in the LRU queue', t => {
  const c = new LRUCache()
  const max = 1000

  for (let i = 0; i < max; i++) {
    c.set(i, i)
  }
  c.set(0, 0)
  c.set(1001, 1001)
  t.equal(c.get(0), 0)
  t.equal(c.get(1), undefined)
  t.end()
})
