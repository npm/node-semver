const compare = require('./compare')

module.exports = function gt (a, b, loose) {
  return compare(a, b, loose) > 0
}