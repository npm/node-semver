const t = require('node:test')
const a = require('node:assert')
t.test('classes', (t) => {
  a.deepEqual(require('../../classes'), {
    SemVer: require('../../classes/semver'),
    Range: require('../../classes/range'),
    Comparator: require('../../classes/comparator'),
  }, 'export all classes at semver/classes')
})
