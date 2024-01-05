const t = require('node:test')
const a = require('node:assert')

const validRange = require('../../ranges/valid')
const rangeParse = require('../fixtures/range-parse.js')

t.test('valid range test', (t) => {
  for (const [pre, wanted, options] of rangeParse) {
    a.equal(validRange(pre, options), wanted,
      `validRange(${pre}) === ${wanted} ${JSON.stringify(options)}`)
  }
})
