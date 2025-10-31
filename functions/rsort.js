'use strict'

const compareBuild = require('./compare-build.js')
const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose))
module.exports = rsort
