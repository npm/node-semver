'use strict'

const compare = require('./compare.js')
const neq = (a, b, loose) => compare(a, b, loose) !== 0
module.exports = neq
