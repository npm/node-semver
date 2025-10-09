'use strict'

const a = require('node:assert')
a.deepEqual(require('../../classes'), {
  SemVer: require('../../classes/semver'),
  Range: require('../../classes/range'),
  Comparator: require('../../classes/comparator'),
}, 'export all classes at semver/classes')
