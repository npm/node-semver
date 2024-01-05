const t = require('node:test')
const a = require('node:assert')

const constants = require('../../internal/constants')

t.test('got appropriate data types exported', t => {
  a.equal(typeof constants.MAX_LENGTH, 'number')
  a.equal(typeof constants.MAX_SAFE_COMPONENT_LENGTH, 'number')
  a.equal(typeof constants.MAX_SAFE_INTEGER, 'number')
  a.ok(Array.isArray(constants.RELEASE_TYPES))
  a.equal(typeof constants.SEMVER_SPEC_VERSION, 'string')
})
