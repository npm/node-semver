'use strict'

const { test } = require('node:test')
const a = require('node:assert')
const semver = require('../')
const { SEMVER_SPEC_VERSION } = require('../internal/constants')

test('SEMVER_SPEC_VERSION property', () => {
  const descriptor = Object.getOwnPropertyDescriptor(semver, 'SEMVER_SPEC_VERSION')
  a.equal(descriptor.value, SEMVER_SPEC_VERSION, 'should have correct value')
  a.equal(descriptor.configurable, true, 'should be configurable')
  a.equal(descriptor.enumerable, true, 'should be enumerable')
})
