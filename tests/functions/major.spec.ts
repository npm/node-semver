import { test } from '@japa/runner'
import major from '../../src/functions/major.js'

test.group('major function tests', () => {
  test('should correctly extract the major version')
    .with([
      ['1.2.3', 1],
      [' 1.2.3 ', 1],
      [' 2.2.3-4 ', 2],
      [' 3.2.3-pre ', 3],
      ['v5.2.3', 5],
      [' v8.2.3 ', 8],
      ['\t13.2.3', 13],
      ['=21.2.3', 21, true],
      ['v=34.2.3', 34, true],
    ] as [string, number, boolean?][])
    .run(({ assert }, [range, expected, loose = false]) => {
      const result = major(range, loose)
      assert.strictEqual(result, expected, `major(${range}, ${loose}) should return ${expected}`)
    })
})
