var outside = require('./outside')

// Determine if version is greater than all the versions possible in the range.
module.exports = function gtr (version, range, options) {
  return outside(version, range, '>', options)
}