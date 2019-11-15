var compare = require('./compare');

module.exports = function rcompare (a, b, loose) {
  return compare(b, a, loose)
}