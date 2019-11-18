var SemVer = require('../SemVer');

module.exports = function major (a, loose) {
  return new SemVer(a, loose).major
}