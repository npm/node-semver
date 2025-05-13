import { test } from '@japa/runner'
import rcompare from '../../src/functions/rcompare.js'

test.group('rcompare function tests', () => {
  test('should correctly compare versions in reverse order')
    .with([
      ['1.0.0', '1.0.1', 1],
      ['1.0.0', '1.0.0', 0],
      ['1.0.0+0', '1.0.0', 0],
      ['1.0.1', '1.0.0', -1],
    ] as [string, string, number][])
    .run(({ assert }, [v1, v2, expected]) => {
      const result = rcompare(v1, v2)
      assert.strictEqual(result, expected, `rcompare(${v1}, ${v2}) should return ${expected}`)
    })
})
