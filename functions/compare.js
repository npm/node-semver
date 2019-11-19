var SemVer = require('../semver');

module.exports = function compare (a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose))
}