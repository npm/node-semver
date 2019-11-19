var compare = require('./compare')

module.exports = function compareLoose (a, b) {
  return compare(a, b, true)
}