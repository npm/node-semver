const parse = require('./parse')

module.exports =function prerelease (version, options) {
  const parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}