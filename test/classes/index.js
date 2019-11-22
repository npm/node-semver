const t = require('tap')
t.same(require('../../classes'), {
  SemVer: require('../../classes/semver'),
  Range: require('../../classes/range'),
  Comparator: require('../../classes/comparator')
}, 'export all classes at semver/classes')
