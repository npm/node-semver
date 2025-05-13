import { test } from '@japa/runner'
import compare from '../../src/functions/compare.js'
import comparisons from '../fixtures/comparisons.js'
import equality from '../fixtures/equality.js'
import SemVer from '../../src/classes/semver.js'

test.group('compare function tests', () => {
  test('comparison tests')
    .with(comparisons)
    .run(({ assert }, [v0, v1, loose]) => {
      assert.strictEqual(compare(v0, v1, loose), 1, `compare('${v0}', '${v1}') should return 1`)
      assert.strictEqual(compare(v1, v0, loose), -1, `compare('${v1}', '${v0}') should return -1`)
      assert.strictEqual(compare(v0, v0, loose), 0, `compare('${v0}', '${v0}') should return 0`)
      assert.strictEqual(compare(v1, v1, loose), 0, `compare('${v1}', '${v1}') should return 0`)
    })

  test('equality tests')
    .with(equality)
    .run(({ assert }, [v0, v1, loose]) => {
      assert.strictEqual(compare(v0, v1, loose), 0, `compare('${v0}', '${v1}') should return 0`)
      assert.strictEqual(compare(v1, v0, loose), 0, `compare('${v1}', '${v0}') should return 0`)
      assert.strictEqual(compare(v0, v0, loose), 0, `compare('${v0}', '${v0}') should return 0`)
      assert.strictEqual(compare(v1, v1, loose), 0, `compare('${v1}', '${v1}') should return 0`)

      // Also test with SemVer objects
      const semVerV0 = new SemVer(v0, { loose })
      const semVerV1 = new SemVer(v1, { loose })
      assert.strictEqual(compare(semVerV0, semVerV1), 0, `compare(${v0}, ${v1}) as SemVer objects should return 0`)
    })
})
