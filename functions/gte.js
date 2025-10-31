'use strict'

const compare = require('./compare.js')
const gte = (a, b, loose) => compare(a, b, loose) >= 0
module.exports = gte
