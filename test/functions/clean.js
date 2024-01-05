const t = require('node:test')
const a = require('node:assert')
const clean = require('../../functions/clean')
const toClean = require('../fixtures/clean')

t.test('clean tests', (t) => {
  for (const [range, version] of toClean) {
    a.equal(clean(range), version, `clean(${range}) = ${version}`)
  }
})
