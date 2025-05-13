import { test } from '@japa/runner'
import minor from '../../src/functions/minor.js'

test.group('minor function tests', () => {
  test('should correctly extract the minor version')
    .with([
      ['1.1.3', 1],
      [' 1.1.3 ', 1],
      [' 1.2.3-4 ', 2],
      [' 1.3.3-pre ', 3],
      ['v1.5.3', 5],
      [' v1.8.3 ', 8],
      ['\t1.13.3', 13],
      ['=1.21.3', 21, true],
      ['v=1.34.3', 34, true],
    ] as [string, number, boolean?][])
    .run(({ assert }, [range, expected, loose = false]) => {
      const result = minor(range, loose)
      assert.strictEqual(result, expected, `minor(${range}, ${loose}) should return ${expected}`)
    })
})
