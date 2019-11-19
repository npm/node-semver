const SemVer = require('../semver')

module.exports = function compareBuild (a, b, loose) {
  const versionA = new SemVer(a, loose)
  const versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}