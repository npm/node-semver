const t = require('node:test')
const a = require('node:assert')

const minor = require('../../functions/minor')
const fixtures = require('../fixtures/minor')

t.test('minor tests', (t) => {
  for (const [range, version, loose] of fixtures) {
    a.equal(minor(range, loose), version, `minor(${range}) = ${version}`)
  }
})
