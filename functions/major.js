'use strict'

const SemVer = require('../classes/semver.js')
const major = (a, loose) => new SemVer(a, loose).major
module.exports = major
