'use strict'

const SemVer = require('../classes/semver.js')
const patch = (a, loose) => new SemVer(a, loose).patch
module.exports = patch
