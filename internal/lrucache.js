class LRUCache {
  constructor (max) {
    if (!Number.isInteger(max) || max < 0) {
      throw new TypeError('max must be a nonnegative integer')
    }

    this.max = max
    this.map = new Map()
  }

  get (key) {
    const value = this.map.get(key)
    if (value === undefined) {
      return undefined
    } else {
      // Remove the key from the map and add it to the end
      this.map.delete(key)
      this.map.set(key, value)
      return value
    }
  }

  has (key) {
    return this.map.has(key)
  }

  delete (key) {
    if (this.map.has(key)) {
      this.map.delete(key)
      return true
    } else {
      return false
    }
  }

  set (key, value) {
    const deleted = this.delete(key)

    if (!deleted && value !== undefined) {
      // If cache is full, delete the least recently used item
      if (this.map.size >= this.max) {
        const firstKey = this.map.keys().next().value
        this.delete(firstKey)
      }

      this.map.set(key, value)
    }

    return this
  }

  clear () {
    this.map.clear()
  }

  capacity () {
    return this.max
  }

  size () {
    return this.map.size
  }

  * entries () {
    for (const [key, value] of this.map) {
      yield [key, value]
    }
  }
}

module.exports = LRUCache
