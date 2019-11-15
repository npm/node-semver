var compare = require('./compare');

module.exports = function lte (a, b, loose) {
  return compare(a, b, loose) <= 0
}