const t = require('node:test')
const a = require('node:assert')

const prerelease = require('../../functions/prerelease')
const fixtures = require('../fixtures/prerelease')

t.test('prerelease', (t) => {
  for (const [expected, version, loose] of fixtures) {
    a.deepEqual(prerelease(version, loose), expected, `prerelease(${version})`)
  }
})
