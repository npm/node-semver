import { test } from '@japa/runner'
import gte from '../../src/functions/gte.js'
import comparisons from '../fixtures/comparisons.js'
import equality from '../fixtures/equality.js'

test.group('gte function tests', () => {
  test('comparison tests')
    .with(comparisons)
    .run(({ assert }, [v0, v1, loose]) => {
      assert.isTrue(gte(v0, v1, loose), `gte('${v0}', '${v1}') should return true`)
      assert.isFalse(gte(v1, v0, loose), `gte('${v1}', '${v0}') should return false`)
      assert.isTrue(gte(v1, v1, loose), `gte('${v1}', '${v1}') should return true`)
      assert.isTrue(gte(v0, v0, loose), `gte('${v0}', '${v0}') should return true`)
    })

  test('equality tests')
    .with(equality)
    .run(({ assert }, [v0, v1, loose]) => {
      assert.isTrue(gte(v0, v1, loose), `gte(${v0}, ${v1}) should return true`)
      assert.isTrue(gte(v1, v0, loose), `gte(${v1}, ${v0}) should return true`)
    })
})
