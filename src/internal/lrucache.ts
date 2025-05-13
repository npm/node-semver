export default class LRUCache<T = unknown> {
  max: number
  map: Map<string, T>

  constructor() {
    this.max = 1000
    this.map = new Map()
  }

  get(key: string): T | undefined {
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

  delete(key: string) {
    return this.map.delete(key)
  }

  set(key: string, value: T) {
    const deleted = this.delete(key)

    if (!deleted && value !== undefined) {
      // If cache is full, delete the least recently used item
      if (this.map.size >= this.max) {
        const firstKey = this.map.keys().next().value
        this.delete(firstKey as string)
      }

      this.map.set(key, value)
    }

    return this
  }
}
