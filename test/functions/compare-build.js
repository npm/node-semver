'use strict'

const { test } = require('tap')
const compareBuild = require('../../functions/compare-build')
const SemVer = require('../../classes/semver')

test('compareBuild', (t) => {
  const noBuild = '1.0.0'
  const build0 = '1.0.0+0'
  const build1 = '1.0.0+1'
  const build10 = '1.0.0+1.0'
  t.equal(compareBuild(noBuild, build0), -1)
  t.equal(compareBuild(build0, build0), 0)
  t.equal(compareBuild(build0, noBuild), 1)

  t.equal(compareBuild(build0, '1.0.0+0.0'), -1)
  t.equal(compareBuild(build0, build1), -1)
  t.equal(compareBuild(build1, build0), 1)
  t.equal(compareBuild(build10, build1), 1)

  t.end()
})

test('compareBuild preserves builds on version objects with different options', t => {
  const higher = new SemVer('1.0.0+2', { loose: true })
  const lower = new SemVer('1.0.0+1', { includePrerelease: true })
  t.equal(compareBuild(higher, lower), 1)
  t.equal(compareBuild(lower, higher), -1)
  t.equal(compareBuild(higher, lower, { includePrerelease: true }), 1)
  t.equal(compareBuild(higher, lower, { loose: true }), 1)
  t.end()
})
