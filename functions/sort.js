'use strict'

const compareBuild = require('./compare-build.js')
const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose))
module.exports = sort
