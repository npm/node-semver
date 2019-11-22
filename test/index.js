const t = require('tap')
const semver = require('../')

t.match(Object.getOwnPropertyDescriptor(semver, 'SEMVER_SPEC_VERSION'), {
  get: Function,
  set: undefined,
  enumerable: true,
  configurable: true
}, 'properties are getters')

const {SEMVER_SPEC_VERSION} = require('../internal/constants')
t.match(semver.SEMVER_SPEC_VERSION, SEMVER_SPEC_VERSION, 'getter returns expected value')
t.match(Object.getOwnPropertyDescriptor(semver, 'SEMVER_SPEC_VERSION'), {
  get: undefined,
  set: undefined,
  value: SEMVER_SPEC_VERSION,
  configurable: true,
  enumerable: true
}, 'replaced with value prop after initial get')

t.match(semver.parse, require('../functions/parse'), 'getter that does not have a subkey')
