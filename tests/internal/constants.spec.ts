import { test } from '@japa/runner'
import * as constants from '../../src/internal/constants.js'

test.group('constants tests', () => {
  test('should export constants with appropriate data types', ({ assert }) => {
    assert.isNumber(constants.MAX_LENGTH, 'MAX_LENGTH should be a number')
    assert.isNumber(constants.MAX_SAFE_COMPONENT_LENGTH, 'MAX_SAFE_COMPONENT_LENGTH should be a number')
    assert.isNumber(constants.MAX_SAFE_INTEGER, 'MAX_SAFE_INTEGER should be a number')
    assert.isArray(constants.RELEASE_TYPES, 'RELEASE_TYPES should be an array')
    assert.isString(constants.SEMVER_SPEC_VERSION, 'SEMVER_SPEC_VERSION should be a string')
  })
})
