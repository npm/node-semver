const parse = require('./parse')
const clean = (version, options) => {
  const s = parse(version.trim().replace(/^[=v]+/i, ''), options)
  return s ? s.version : null
}
module.exports = clean
