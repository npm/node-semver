var compare = require('./compare');

module.exports = function neq (a, b, loose) {
  return compare(a, b, loose) !== 0
}