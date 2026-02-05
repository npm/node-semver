'use strict'

const t = require('tap')
t.same(require('semver/classes'), {
  SemVer: require('semver/classes/semver'),
  Range: require('semver/classes/range'),
  Comparator: require('semver/classes/comparator'),
}, 'export all classes at semver/classes')
