'use strict'

const outside = require('./outside.js')
// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options) => outside(version, range, '<', options)
module.exports = ltr
