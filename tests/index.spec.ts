import { test } from '@japa/runner'
import semver from '../src/index.js'
import { SEMVER_SPEC_VERSION } from '../src/internal/constants.js'

test.group('semver index tests', () => {
  test('SEMVER_SPEC_VERSION should be a normal value property', ({ assert }) => {
    const descriptor = Object.getOwnPropertyDescriptor(semver, 'SEMVER_SPEC_VERSION')
    assert.deepEqual(
      descriptor,
      {
        value: SEMVER_SPEC_VERSION,
        configurable: true,
        enumerable: true,
        writable: true,
      },
      'SEMVER_SPEC_VERSION should have the correct property descriptor'
    )
  })
})
