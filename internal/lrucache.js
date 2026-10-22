'use strict'

// Two generations, with no reordering on read. A hit in the old generation is
// promoted back into the live one. When the live generation fills up it becomes
// the old one and the previous old generation is dropped, so at most 2 * max
// entries are retained.
class LRUCache {
  constructor () {
    this.max = 1000
    this.map = new Map()
    this.old = new Map()
  }

  get (key) {
    const value = this.map.get(key)
    if (value !== undefined) {
      return value
    }
    const stale = this.old.get(key)
    if (stale !== undefined) {
      this.set(key, stale)
      return stale
    }
    return undefined
  }

  delete (key) {
    const inMap = this.map.delete(key)
    const inOld = this.old.delete(key)
    return inMap || inOld
  }

  set (key, value) {
    if (value === undefined) {
      return this
    }

    if (!this.map.has(key) && this.map.size >= this.max) {
      this.old = this.map
      this.map = new Map()
    }

    this.map.set(key, value)
    return this
  }
}

module.exports = LRUCache
