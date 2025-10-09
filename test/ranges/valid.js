'use strict'

const { test } = require('node:test')
const a = require('node:assert')
const validRange = require('../../ranges/valid')
const rangeParse = require('../fixtures/range-parse.js')

test('valid range test', () => {
  // validRange(range) -> result
  // translate ranges into their canonical form
  for (const [pre, wanted, options] of rangeParse) {
    a.equal(validRange(pre, options), wanted,
      `validRange(${pre}) === ${wanted} ${JSON.stringify(options)}`)
  }
})
