'use strict'

const { test } = require('node:test')
const a = require('node:assert')
const ltr = require('../../ranges/ltr')
const versionLtr = require('../fixtures/version-lt-range')
const versionNotLtr = require('../fixtures/version-not-lt-range')

test('ltr tests', () => {
  // [range, version, options]
  // Version should be less than range
  versionLtr.forEach(([range, version, options = false]) => {
    const msg = `ltr(${version}, ${range}, ${options})`
    a.ok(ltr(version, range, options), msg)
  })
})

test('negative ltr tests', () => {
  // [range, version, options]
  // Version should NOT be less than range
  versionNotLtr.forEach(([range, version, options = false]) => {
    const msg = `!ltr(${version}, ${range}, ${options})`
    a.ok(!ltr(version, range, options), msg)
  })
})
