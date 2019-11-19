var outside = require('./outside')

// Determine if version is less than all the versions possible in the range
module.exports = function ltr (version, range, options) {
  return outside(version, range, '<', options)
}