'use strict'

const compare = require('./compare.js')
const compareLoose = (a, b) => compare(a, b, true)
module.exports = compareLoose
