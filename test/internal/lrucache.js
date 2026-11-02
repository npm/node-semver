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
  t.equal(c.get(1001), 1001)
  // setting undefined is a no-op and does not clobber an existing value
  t.equal(c.set(42, undefined), c)
  t.equal(c.get(42), 42)
  t.equal(c.get('not-in-the-cache'), undefined)
  t.end()
})

test('delete removes the key from both generations', t => {
  const c = new LRUCache()
  const max = 1000

  for (let i = 0; i < max; i++) {
    c.set(i, i)
  }
  // fills the live generation, demoting everything above into the old one
  c.set('rotate', 1)
  c.set(7, 'live')

  t.equal(c.delete(7), true)
  t.equal(c.get(7), undefined)
  t.equal(c.delete(7), false)
  t.end()
})

test('entries are evicted once the cache is full', t => {
  const c = new LRUCache()

  for (let i = 0; i < 10 * c.max; i++) {
    c.set(i, i)
  }
  t.equal(c.get(0), undefined)
  t.ok(c.map.size + c.old.size <= 2 * c.max)
  t.end()
})

test('promoting from the old generation stays within the bound', t => {
  const c = new LRUCache()
  const max = c.max

  for (let i = 0; i < max; i++) {
    c.set(`a${i}`, i)
  }
  c.set('rotate', 1)
  for (let i = 0; i < max - 2; i++) {
    c.set(`b${i}`, i)
  }
  for (let i = 0; i < max; i++) {
    c.get(`a${i}`)
  }

  t.ok(c.map.size + c.old.size <= 2 * max)
  t.end()
})
