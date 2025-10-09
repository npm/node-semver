'use strict'

const { test } = require('node:test')
const a = require('node:assert')
const gtr = require('../../ranges/gtr')
const versionGtr = require('../fixtures/version-gt-range')
const versionNotGtr = require('../fixtures/version-not-gt-range')

test('gtr tests', () => {
  // [range, version, options]
  // Version should be greater than range
  versionGtr.forEach((tuple) => {
    const range = tuple[0]
    const version = tuple[1]
    const options = tuple[2] || false
    const msg = `gtr(${version}, ${range}, ${options})`
    a.ok(gtr(version, range, options), msg)
  })
})

test('negative gtr tests', () => {
  // [range, version, options]
  // Version should NOT be greater than range
  versionNotGtr.forEach((tuple) => {
    const range = tuple[0]
    const version = tuple[1]
    const options = tuple[2] || false
    const msg = `!gtr(${version}, ${range}, ${options})`
    a.ok(!gtr(version, range, options), msg)
  })
})
