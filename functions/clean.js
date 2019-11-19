const parse = require('./parse')

module.exports = function clean (version, options) {
  const s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}