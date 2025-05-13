import { test } from '@japa/runner'
import patch from '../../src/functions/patch.js'

test.group('patch function tests', () => {
  test('should correctly extract the patch version')
    .with([
      ['1.2.1', 1],
      [' 1.2.1 ', 1],
      [' 1.2.2-4 ', 2],
      [' 1.2.3-pre ', 3],
      ['v1.2.5', 5],
      [' v1.2.8 ', 8],
      ['\t1.2.13', 13],
      ['=1.2.21', 21, true],
      ['v=1.2.34', 34, true],
    ] as [string, number, boolean?][])
    .run(({ assert }, [range, expected, loose = false]) => {
      const result = patch(range, loose)
      assert.strictEqual(result, expected, `patch(${range}, ${loose}) should return ${expected}`)
    })
})
