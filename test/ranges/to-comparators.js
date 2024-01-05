const t = require('node:test')
const a = require('node:assert')

const toComparators = require('../../ranges/to-comparators')

const fixtures = require('../fixtures/to-comparitors')

t.test('comparators test', (t) => {
  for (const [pre, wanted] of fixtures) {
    const found = toComparators(pre)
    const jw = JSON.stringify(wanted)
    a.deepEqual(found, wanted, `toComparators(${pre}) === ${jw}`)
  }
})
