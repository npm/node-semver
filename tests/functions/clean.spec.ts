import { test } from '@japa/runner'
import clean from '../../src/functions/clean.js'

test.group('clean tests', () => {
  test('clean function should return the expected version or null')
    .with([
      ['1.2.3', '1.2.3'],
      [' 1.2.3 ', '1.2.3'],
      [' 1.2.3-4 ', '1.2.3-4'],
      [' 1.2.3-pre ', '1.2.3-pre'],
      ['  =v1.2.3   ', '1.2.3'],
      ['v1.2.3', '1.2.3'],
      [' v1.2.3 ', '1.2.3'],
      ['\t1.2.3', '1.2.3'],
      ['>1.2.3', null],
      ['~1.2.3', null],
      ['<=1.2.3', null],
      ['1.2.x', null],
      ['0.12.0-dev.1150+3c22cecee', '0.12.0-dev.1150'],
    ] as [string, string | null][])
    .run(({ assert }, [range, expected]) => {
      const result = clean(range)
      assert.strictEqual(result, expected, `clean(${range}) should return ${expected}`)
    })
})
