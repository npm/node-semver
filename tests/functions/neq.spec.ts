import { test } from '@japa/runner'
import neq from '../../src/functions/neq.js'
import comparisons from '../fixtures/comparisons.js'
import equality from '../fixtures/equality.js'

test.group('neq function tests', () => {
  test('comparison tests')
    .with(comparisons)
    .run(({ assert }, [v0, v1, loose]) => {
      assert.isTrue(neq(v0, v1, loose), `neq(${v0}, ${v1}) should return true`)
      assert.isTrue(neq(v1, v0, loose), `neq(${v1}, ${v0}) should return true`)
      assert.isFalse(neq(v1, v1, loose), `neq(${v1}, ${v1}) should return false`)
      assert.isFalse(neq(v0, v0, loose), `neq(${v0}, ${v0}) should return false`)
    })

  test('equality tests')
    .with(equality)
    .run(({ assert }, [v0, v1, loose]) => {
      assert.isFalse(neq(v0, v1, loose), `neq(${v0}, ${v1}) should return false`)
      assert.isFalse(neq(v1, v0, loose), `neq(${v1}, ${v0}) should return false`)
      assert.isFalse(neq(v0, v0, loose), `neq(${v0}, ${v0}) should return false`)
      assert.isFalse(neq(v1, v1, loose), `neq(${v1}, ${v1}) should return false`)
    })
})
