'use strict'

const t = require('tap')
t.same(require('../../classes/index.js'), {
  SemVer: require('../../classes/semver'),
  Range: require('../../classes/range'),
  Comparator: require('../../classes/comparator'),
}, 'export all classes at semver/classes')
