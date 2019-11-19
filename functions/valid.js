var parse = require('./parse')

module.exports = function valid (version, options) {
  var v = parse(version, options)
  return v ? v.version : null
}