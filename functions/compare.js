'use strict'

const SemVer = require('../classes/semver.js')
const compare = (a, b, loose) =>
  new SemVer(a, loose).compare(new SemVer(b, loose))

module.exports = compare
