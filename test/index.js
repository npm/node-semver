const t = require('tap')
const semver = require('../')
const {SEMVER_SPEC_VERSION} = require('../internal/constants')

t.match(Object.getOwnPropertyDescriptor(semver, 'SEMVER_SPEC_VERSION'), {
  get: undefined,
  set: undefined,
  value: SEMVER_SPEC_VERSION,
  configurable: true,
  enumerable: true
}, 'just a normal value property')

if (semver.gte(process.version, '14.0.0')) {
  t.spawn(process.execPath, require.resolve('./esm-wrapper.mjs'))
}
