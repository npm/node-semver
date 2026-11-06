'use strict'

const SemVer = require('../classes/semver')
const sort = (list, loose) => {
  // parse each version once rather than on every comparison
  const cache = new Map()
  const parse = (v) => {
    let version = cache.get(v)
    if (version === undefined) {
      version = new SemVer(v, loose)
      cache.set(v, version)
    }
    return version
  }
  return list.sort((a, b) => {
    const versionA = parse(a)
    const versionB = parse(b)
    return versionA.compare(versionB) || versionA.compareBuild(versionB)
  })
}
module.exports = sort
