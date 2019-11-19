var SemVer = require('../semver');

module.exports = function patch (a, loose) {
  return new SemVer(a, loose).patch
}