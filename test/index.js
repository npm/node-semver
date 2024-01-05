const t = require('node:test')
const a = require('node:assert')

const semver = require('../')
const { SEMVER_SPEC_VERSION } = require('../internal/constants')

t.test('SEMVER_SPEC_VERSION is exported', t => {
  const descriptor = Object.getOwnPropertyDescriptor(semver, 'SEMVER_SPEC_VERSION')
  a.deepEqual(descriptor, {
    value: SEMVER_SPEC_VERSION,
    writable: true,
    enumerable: true,
    configurable: true,
  }, 'just a normal value property')
  a.equal(descriptor.get, undefined, 'no getter')
  a.equal(descriptor.set, undefined, 'no setter')
})
