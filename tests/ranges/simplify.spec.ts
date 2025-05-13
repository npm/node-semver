import { test } from '@japa/runner'
import simplify from '../../src/ranges/simplify.js'
import Range from '../../src/classes/range.js'

const versions = [
  '1.0.0',
  '1.0.1',
  '1.0.2',
  '1.0.3',
  '1.0.4',
  '1.1.0',
  '1.1.1',
  '1.1.2',
  '1.2.0',
  '1.2.1',
  '1.2.2',
  '1.2.3',
  '1.2.4',
  '1.2.5',
  '2.0.0',
  '2.0.1',
  '2.1.0',
  '2.1.1',
  '2.1.2',
  '2.2.0',
  '2.2.1',
  '2.2.2',
  '2.3.0',
  '2.3.1',
  '2.4.0',
  '3.0.0',
  '3.1.0',
  '3.2.0',
  '3.3.0',
]

test.group('simplify function tests', () => {
  test('simplify ranges')
    .with([
      ['1.x', '1.x'],
      ['1.0.0 || 1.0.1 || 1.0.2 || 1.0.3 || 1.0.4', '<=1.0.4'],
      [new Range('1.0.0 || 1.0.1 || 1.0.2 || 1.0.3 || 1.0.4'), '<=1.0.4'],
      ['>=3.0.0 <3.1.0', '3.0.0'],
      ['3.0.0 || 3.1 || 3.2 || 3.3', '>=3.0.0'],
      ['1 || 2 || 3', '*'],
      ['2.1 || 2.2 || 2.3', '2.1.0 - 2.3.1'],
    ] as [string | Range, string][])
    .run(({ assert }, [range, expected]) => {
      const result = simplify(versions, range)
      assert.strictEqual(result, expected, `simplify(${JSON.stringify(range)}) should return ${expected}`)
    })
})
