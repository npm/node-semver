const SemVer = require('../classes/semver')

module.exports = function minor (a, loose) {
  return new SemVer(a, loose).minor
}