import { test } from '@japa/runner'
import gt from '../../src/functions/gt.js'
import comparisons from '../fixtures/comparisons.js'
import equality from '../fixtures/equality.js'

test.group('gt function tests', () => {
  test('comparison tests')
    .with(comparisons)
    .run(({ assert }, [v0, v1, loose]) => {
      assert.isTrue(gt(v0, v1, loose), `gt('${v0}', '${v1}') should return true`)
      assert.isFalse(gt(v1, v0, loose), `gt('${v1}', '${v0}') should return false`)
      assert.isFalse(gt(v1, v1, loose), `gt('${v1}', '${v1}') should return false`)
      assert.isFalse(gt(v0, v0, loose), `gt('${v0}', '${v0}') should return false`)
    })

  test('equality tests')
    .with(equality)
    .run(({ assert }, [v0, v1, loose]) => {
      assert.isFalse(gt(v0, v1, loose), `gt('${v0}', '${v1}') should return false`)
      assert.isFalse(gt(v1, v0, loose), `gt('${v1}', '${v0}') should return false`)
    })
})
