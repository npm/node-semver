import { test } from '@japa/runner'
import gtr from '../../src/ranges/gtr.js'
import versionGtr from '../fixtures/version-gt-range.js'
import versionNotGtr from '../fixtures/version-not-gt-range.js'

test.group('gtr function tests', () => {
  test('versions should be greater than range')
    .with(versionGtr)
    .run(({ assert }, [range, version, options = false]) => {
      const msg = `gtr(${version}, ${range}, ${options})`
      assert.isTrue(gtr(version, range, options), msg)
    })

  test('versions should NOT be greater than range')
    .with(versionNotGtr)
    .run(({ assert }, [range, version, options = false]) => {
      const msg = `!gtr(${version}, ${range}, ${options})`
      assert.isFalse(gtr(version, range, options), msg)
    })
})
