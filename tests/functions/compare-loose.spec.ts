import { test } from '@japa/runner'
import compareLoose from '../../src/functions/compare-loose.js'
import SemVer from '../../src/classes/semver.js'
import eq from '../../src/functions/eq.js'

test.group('compareLoose function tests', () => {
  test('strict vs loose version numbers')
    .with([
      ['=1.2.3', '1.2.3'],
      ['01.02.03', '1.2.3'],
      ['1.2.3-beta.01', '1.2.3-beta.1'],
      ['   =1.2.3', '1.2.3'],
      ['1.2.3foo', '1.2.3-foo'],
    ])
    .run(({ assert }, [loose, strict]) => {
      // Loose parsing should succeed
      const lv = new SemVer(loose, { loose: true })
      assert.strictEqual(lv.version, strict, `Loose version ${loose} should normalize to ${strict}`)

      // Strict parsing should throw
      assert.throws(() => {
        new SemVer(loose)
      })

      // Equality checks
      assert.isTrue(eq(loose, strict, { loose: true }), `Loose equality of ${loose} and ${strict} should be true`)
      assert.throws(() => eq(loose, strict))

      // Comparison checks
      assert.throws(() => new SemVer(strict).compare(loose))
      assert.strictEqual(compareLoose(loose, strict), 0, `Loose comparison of ${loose} and ${strict} should return 0`)
    })
})
