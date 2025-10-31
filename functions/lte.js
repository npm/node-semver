'use strict'

const compare = require('./compare.js')
const lte = (a, b, loose) => compare(a, b, loose) <= 0
module.exports = lte
