const parse = require('./parse')

module.exports = function valid (version, options) {
  const v = parse(version, options)
  return v ? v.version : null
}