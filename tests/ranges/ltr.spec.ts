import { test } from '@japa/runner'
import ltr from '../../src/ranges/ltr.js'
import versionLtr from '../fixtures/version-lt-range.js'
import versionNotLtr from '../fixtures/version-not-lt-range.js'

test.group('ltr function tests', () => {
  test('versions should be less than range')
    .with(versionLtr)
    .run(({ assert }, [range, version, options = false]) => {
      const msg = `ltr(${version}, ${range}, ${options})`
      assert.isTrue(ltr(version, range, options), msg)
    })

  test('versions should NOT be less than range')
    .with(versionNotLtr)
    .run(({ assert }, [range, version, options = false]) => {
      const msg = `!ltr(${version}, ${range}, ${options})`
      assert.isFalse(ltr(version, range, options), msg)
    })
})
