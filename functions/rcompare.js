'use strict'

const compare = require('./compare.js')
const rcompare = (a, b, loose) => compare(b, a, loose)
module.exports = rcompare
