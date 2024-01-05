const t = require('node:test')
const a = require('node:assert')

const major = require('../../functions/major')
const fixtures = require('../fixtures/major')

t.test('major tests', (t) => {
  for (const [range, version, loose] of fixtures) {
    a.equal(major(range, loose), version, `major(${range}) = ${version}`)
  }
})
