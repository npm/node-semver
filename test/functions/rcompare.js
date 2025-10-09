'use strict'

const { test } = require('node:test')
const a = require('node:assert')
const rcompare = require('../../functions/rcompare')

test('rcompare', () => {
  a.equal(rcompare('1.0.0', '1.0.1'), 1)
  a.equal(rcompare('1.0.0', '1.0.0'), 0)
  a.equal(rcompare('1.0.0+0', '1.0.0'), 0)
  a.equal(rcompare('1.0.1', '1.0.0'), -1)
})
