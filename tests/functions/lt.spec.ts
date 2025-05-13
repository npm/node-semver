import { test } from '@japa/runner'
import lt from '../../src/functions/lt.js'
import comparisons from '../fixtures/comparisons.js'
import equality from '../fixtures/equality.js'

test.group('lt function tests', () => {
  test('comparison tests')
    .with(comparisons)
    .run(({ assert }, [v0, v1, loose]) => {
      assert.isFalse(lt(v0, v1, loose), `!lt('${v0}', '${v1}')`)
      assert.isTrue(lt(v1, v0, loose), `lt('${v1}', '${v0}')`)
      assert.isFalse(lt(v1, v1, loose), `!lt('${v1}', '${v1}')`)
      assert.isFalse(lt(v0, v0, loose), `!lt('${v0}', '${v0}')`)
    })

  test('equality tests')
    .with(equality)
    .run(({ assert }, [v0, v1, loose]) => {
      assert.isFalse(lt(v0, v1, loose), `!lt(${v0}, ${v1})`)
      assert.isFalse(lt(v1, v0, loose), `!lt(${v1}, ${v0})`)
    })
})
