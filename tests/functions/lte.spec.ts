import { test } from '@japa/runner'
import lte from '../../src/functions/lte.js'
import comparisons from '../fixtures/comparisons.js'
import equality from '../fixtures/equality.js'

test.group('lte function tests', () => {
  test('comparison tests')
    .with(comparisons)
    .run(({ assert }, [v0, v1, loose]) => {
      assert.isFalse(lte(v0, v1, loose), `!lte('${v0}', '${v1}')`)
      assert.isTrue(lte(v1, v0, loose), `lte('${v1}', '${v0}')`)
      assert.isTrue(lte(v1, v1, loose), `lte('${v1}', '${v1}')`)
      assert.isTrue(lte(v0, v0, loose), `lte('${v0}', '${v0}')`)
    })

  test('equality tests')
    .with(equality)
    .run(({ assert }, [v0, v1, loose]) => {
      assert.isTrue(lte(v0, v1, loose), `lte(${v0}, ${v1})`)
      assert.isTrue(lte(v1, v0, loose), `lte(${v1}, ${v0})`)
    })
})
