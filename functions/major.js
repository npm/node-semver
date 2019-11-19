const SemVer = require('../classes/semver')

module.exports = function major (a, loose) {
  return new SemVer(a, loose).major
}