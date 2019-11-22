const { test } = require('tap')
const validRange = require('../../ranges/valid')
const rangeParse = require('../fixtures/range-parse.js')

test('valid range test', (t) => {
  // validRange(range) -> result
  // translate ranges into their canonical form
  t.plan(rangeParse.length)
  rangeParse.forEach(([pre, wanted, options]) =>
    t.equal(validRange(pre, options), wanted,
      `validRange(${pre}) === ${wanted}`))
})
