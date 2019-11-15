var SemVer = require('../SemVer');

module.exports = function minor (a, loose) {
  return new SemVer(a, loose).minor
}