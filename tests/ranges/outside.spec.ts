import { test } from '@japa/runner'
import outside from '../../src/ranges/outside.js'
import versionGtr from '../fixtures/version-gt-range.js'
import versionNotGtr from '../fixtures/version-not-gt-range.js'
import versionLtr from '../fixtures/version-lt-range.js'
import versionNotLtr from '../fixtures/version-not-lt-range.js'

test.group('outside function tests', () => {
  test('versions should be greater than range')
    .with(versionGtr)
    .run(({ assert }, [range, version, options = false]) => {
      const msg = `outside(${version}, ${range}, >, ${options})`
      assert.isTrue(outside(version, range, '>', options), msg)
    })

  test('versions should be less than range')
    .with(versionLtr)
    .run(({ assert }, [range, version, options = false]) => {
      const msg = `outside(${version}, ${range}, <, ${options})`
      assert.isTrue(outside(version, range, '<', options), msg)
    })

  test('versions should NOT be greater than range')
    .with(versionNotGtr)
    .run(({ assert }, [range, version, options = false]) => {
      const msg = `!outside(${version}, ${range}, >, ${options})`
      assert.isFalse(outside(version, range, '>', options), msg)
    })

  test('versions should NOT be less than range')
    .with(versionNotLtr)
    .run(({ assert }, [range, version, options = false]) => {
      const msg = `!outside(${version}, ${range}, <, ${options})`
      assert.isFalse(outside(version, range, '<', options), msg)
    })

  test('outside with bad hilo throws', ({ assert }) => {
    assert.throws(
      () => {
        // @ts-expect-error Test invalid hilo
        outside('1.2.3', '>1.5.0', 'blerg', true)
      }
      // new TypeError('Must provide a hilo val of "<" or ">"'),
      // 'outside with invalid hilo should throw a TypeError'
    )
  })
})
