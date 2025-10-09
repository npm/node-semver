'use strict'

const { test } = require('node:test')
const a = require('node:assert')
const constants = require('../../internal/constants')

test('exports appropriate data types', () => {
  a.equal(typeof constants.MAX_LENGTH, 'number')
  a.equal(typeof constants.MAX_SAFE_COMPONENT_LENGTH, 'number')
  a.equal(typeof constants.MAX_SAFE_INTEGER, 'number')
  a.ok(Array.isArray(constants.RELEASE_TYPES))
  a.equal(typeof constants.SEMVER_SPEC_VERSION, 'string')
})
