const t = require('node:test')
const a = require('node:assert')

const patch = require('../../functions/patch')
const fixtures = require('../fixtures/patch')

t.test('patch tests', (t) => {
  for (const [range, version, loose] of fixtures) {
    a.equal(patch(range, loose), version, `patch(${range}) = ${version}`)
  }
})
