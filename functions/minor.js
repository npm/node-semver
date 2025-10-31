'use strict'

const SemVer = require('../classes/semver.js')
const minor = (a, loose) => new SemVer(a, loose).minor
module.exports = minor
