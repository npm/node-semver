import { test } from '@japa/runner'
import LRUCache from '../../src/internal/lrucache.js'

test.group('LRUCache tests', () => {
  test('basic cache operation', ({ assert }) => {
    const cache = new LRUCache<number | undefined, number>()
    const max = 1000

    // Add items to the cache
    for (let i = 0; i < max; i++) {
      assert.strictEqual(cache.set(i, i), cache, `cache.set(${i}, ${i}) should return the cache instance`)
    }

    // Retrieve items from the cache
    for (let i = 0; i < max; i++) {
      assert.strictEqual(cache.get(i), i, `cache.get(${i}) should return ${i}`)
    }

    // Add an item to exceed the cache limit
    cache.set(1001, 1001)

    // The least recently used item should be removed
    assert.isUndefined(cache.get(0), 'cache.get(0) should return undefined after exceeding the cache limit')

    // Add an item with an undefined value
    cache.set(42, undefined)
    assert.isUndefined(
      cache.get(42),
      'cache.get(42) should return undefined when the value is explicitly set to undefined'
    )
  })
})
