var SemVer = require('../semver')

module.exports = function major (a, loose) {
  return new SemVer(a, loose).major
}