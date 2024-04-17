const { test } = require('tap')
const LRUCache = require('../../internal/lrucache')

test('basic cache operation', t => {
  const c = new LRUCache(10)

  // 1. Fill cache with 5 items
  for (let i = 0; i < 5; i++) {
    t.equal(c.set(i, i), c)
  }
  for (let i = 0; i < 5; i++) {
    t.equal(c.get(i), i)
  }
  t.equal(c.size(), 5)

  // 2. Fill cache with 5 more items
  for (let i = 5; i < 10; i++) {
    c.set(i, i)
  }
  t.equal(c.size(), 10)

  // 3. Get first 5 items
  for (let i = 0; i < 5; i++) {
    // this doesn't change anything, but shouldn't be a problem.
    c.get(i)
  }
  t.equal(c.size(), 10)

  // 4. Get next 5 items and add 5 more
  for (let i = 5; i < 10; i++) {
    c.get(i)
  }
  for (let i = 10; i < 15; i++) {
    c.set(i, i)
  }
  t.equal(c.size(), 10)

  // 5. Add another 5 items
  for (let i = 15; i < 20; i++) {
    c.set(i, i)
  }
  t.equal(c.size(), 10)

  // 6. First 10 items got pruned and replaced
  for (let i = 0; i < 10; i++) {
    t.equal(c.get(i), undefined)
  }

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
  // lru item should be gone
  c.set(42, undefined)
  t.equal(c.size(), 10)

  t.end()
})
