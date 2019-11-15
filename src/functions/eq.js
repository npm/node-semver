var compare = require('./compare');

module.exports = function eq (a, b, loose) {
  return compare(a, b, loose) === 0
}