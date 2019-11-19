var compare = require('./compare')

module.exports = function lt (a, b, loose) {
  return compare(a, b, loose) < 0
}