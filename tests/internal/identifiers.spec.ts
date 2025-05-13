import { test } from '@japa/runner'
import { compareIdentifiers, rcompareIdentifiers } from '../../src/internal/identifiers.js'

test.group('compareIdentifiers and rcompareIdentifiers tests', () => {
  test('compare and reverse compare identifiers')
    .with([
      ['1', '2', -1, 1],
      ['alpha', 'beta', -1, 1],
      ['0', 'beta', -1, 1],
      ['0', '0', 0, 0],
    ])
    .run(({ assert }, [a, b, expectedCompare, expectedRCompare]) => {
      assert.strictEqual(
        compareIdentifiers(a, b),
        expectedCompare,
        `compareIdentifiers(${a}, ${b}) should return ${expectedCompare}`
      )
      assert.strictEqual(
        rcompareIdentifiers(a, b),
        expectedRCompare,
        `rcompareIdentifiers(${a}, ${b}) should return ${expectedRCompare}`
      )
    })
})
