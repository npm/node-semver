const { test } = require('tap')
const SemVer = require('../../classes/semver')

test('compareBuild', (t) => {
  const noBuild = new SemVer('1.0.0')
  const build0 = new SemVer('1.0.0+0')
  const build1 = new SemVer('1.0.0+1')
  const build10 = new SemVer('1.0.0+1.0')
  t.equal(noBuild.compareBuild(build0), -1)
  t.equal(build0.compareBuild(build0), 0)
  t.equal(build0.compareBuild(noBuild), 1)

  t.equal(build0.compareBuild('1.0.0+0.0'), -1)
  t.equal(build0.compareBuild(build1), -1)
  t.equal(build1.compareBuild(build0), 1)
  t.equal(build10.compareBuild(build1), 1)

  t.end()
})