const t = require('node:test')
const a = require('node:assert')

const compareBuild = require('../../functions/compare-build')

t.test('compareBuild', (t) => {
  const noBuild = '1.0.0'
  const build0 = '1.0.0+0'
  const build1 = '1.0.0+1'
  const build10 = '1.0.0+1.0'
  a.equal(compareBuild(noBuild, build0), -1)
  a.equal(compareBuild(build0, build0), 0)
  a.equal(compareBuild(build0, noBuild), 1)

  a.equal(compareBuild(build0, '1.0.0+0.0'), -1)
  a.equal(compareBuild(build0, build1), -1)
  a.equal(compareBuild(build1, build0), 1)
  a.equal(compareBuild(build10, build1), 1)
})
