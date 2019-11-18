var SemVer = require('../SemVer');

module.exports = function patch (a, loose) {
  return new SemVer(a, loose).patch
}