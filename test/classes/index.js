'use strict'

const t = require('tap')
t.same(require('../../classes/index.js'), {
  SemVer: require('../../classes/semver.js'),
  Range: require('../../classes/range.js'),
  Comparator: require('../../classes/comparator.js'),
}, 'export all classes at semver/classes')
