const { test } = require('tap')
const LRUCache = require('../../internal/lrucache')

test('basic cache operation', t => {
  const c = new LRUCache(10)

  t.equal(c.capacity(), 10)

  // 1. Fill cache with 5 items
  for (let i = 0; i < 5; i++) {
    t.equal(c.set(i, i), c)
  }
  for (let i = 0; i < 5; i++) {
    t.equal(c.get(i), i)
  }
  t.equal(c.size(), 5)
  t.matchSnapshot(c.entries())

  // 2. Fill cache with 5 more items
  for (let i = 5; i < 10; i++) {
    c.set(i, i)
  }
  t.equal(c.size(), 10)
  t.matchSnapshot(c.entries())

  // 3. Get first 5 items
  for (let i = 0; i < 5; i++) {
    // this doesn't change anything, but shouldn't be a problem.
    c.get(i)
  }
  t.equal(c.size(), 10)
  t.matchSnapshot(c.entries())

  // 4. Get next 5 items and add 5 more
  for (let i = 5; i < 10; i++) {
    c.get(i)
  }
  for (let i = 10; i < 15; i++) {
    c.set(i, i)
  }
  t.equal(c.size(), 10)
  t.matchSnapshot(c.entries())

  // 5. Add another 5 items
  for (let i = 15; i < 20; i++) {
    c.set(i, i)
  }
  t.equal(c.size(), 10)
  t.matchSnapshot(c.entries())

  // 6. First 10 items got pruned and replaced
  for (let i = 0; i < 10; i++) {
    t.equal(c.get(i), undefined)
  }
  t.matchSnapshot(c.entries())

  // 7. Add 9 new items
  for (let i = 0; i < 9; i++) {
    c.set(i, i)
  }
  t.equal(c.size(), 10)
  // last item is still there
  t.equal(c.delete(19), true)
  // but now it's gone
  t.equal(c.delete(19), false)
  t.equal(c.size(), 9)
  // back to 10 items
  c.set(10, 10)
  t.equal(c.size(), 10)
  t.matchSnapshot(c.entries())

  // 8. Clear cache and fill again
  c.clear()
  t.equal(c.size(), 0)
  for (let i = 0; i < 10; i++) {
    c.set(i, i)
  }
  t.equal(c.size(), 10)
  t.matchSnapshot(c.entries())

  // 9. Unset an item
  t.equal(c.has(0), true)
  t.equal(c.size(), 10)
  c.set(1, undefined)
  t.equal(c.has(1), false)
  t.equal(c.size(), 9)
  t.matchSnapshot(c.entries())

  // Capacity hasn't changed
  t.equal(c.capacity(), 10)

  t.end()
})

test('good max values', t => {
  // max must be a positive integer
  t.doesNotThrow(() => new LRUCache(0))
  t.doesNotThrow(() => new LRUCache(10))
  t.doesNotThrow(() => new LRUCache(1000))
  t.end()
})

test('bad max values', t => {
  // max must be a positive integer
  t.throws(() => new LRUCache(-123))
  t.throws(() => new LRUCache(2.5))
  t.throws(() => new LRUCache(null))
  t.throws(() => new LRUCache(Infinity))
  t.throws(() => new LRUCache({}))
  t.throws(() => new LRUCache([]))
  t.end()
})
