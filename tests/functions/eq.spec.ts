import { test } from '@japa/runner'
import eq from '../../src/functions/eq.js'
import comparisons from '../fixtures/comparisons.js'
import equality from '../fixtures/equality.js'

test.group('eq function tests', () => {
  test('comparison tests')
    .with(comparisons)
    .run(({ assert }, [v0, v1, loose]) => {
      assert.isFalse(eq(v0, v1, loose), `!eq(${v0}, ${v1})`)
      assert.isFalse(eq(v1, v0, loose), `!eq(${v1}, ${v0})`)
      assert.isTrue(eq(v1, v1, loose), `eq('${v1}', '${v1}')`)
      assert.isTrue(eq(v0, v0, loose), `eq('${v0}', '${v0}')`)
    })

  test('equality tests')
    .with(equality)
    .run(({ assert }, [v0, v1, loose]) => {
      assert.isTrue(eq(v0, v1, loose), `eq(${v0}, ${v1})`)
      assert.isTrue(eq(v1, v0, loose), `eq(${v1}, ${v0})`)
      assert.isTrue(eq(v0, v0, loose), `eq(${v0}, ${v0})`)
      assert.isTrue(eq(v1, v1, loose), `eq(${v1}, ${v1})`)
    })
})
