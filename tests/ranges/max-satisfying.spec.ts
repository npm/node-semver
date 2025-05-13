import { test } from '@japa/runner'
import maxSatisfying from '../../src/ranges/max-satisfying.js'

test.group('max satisfying tests', () => {
  test('max satisfying versions')
    .with([
      [['1.2.3', '1.2.4'], '1.2', '1.2.4'],
      [['1.2.4', '1.2.3'], '1.2', '1.2.4'],
      [['1.2.3', '1.2.4', '1.2.5', '1.2.6'], '~1.2.3', '1.2.6'],
      [
        ['1.1.0', '1.2.0', '1.2.1', '1.3.0', '2.0.0b1', '2.0.0b2', '2.0.0b3', '2.0.0', '2.1.0'],
        '~2.0.0',
        '2.0.0',
        true,
      ],
    ] as [string[], string, string, boolean?][])
    .run(({ assert }, [versions, range, expected, loose = false]) => {
      const actual = maxSatisfying(versions, range, loose)
      assert.strictEqual(
        actual,
        expected,
        `maxSatisfying(${JSON.stringify(versions)}, ${range}, ${loose}) should return ${expected}`
      )
    })

  test('bad ranges in max satisfying')
    .with([[[], 'some frogs and sneks-v2.5.6', null]] as [string[], string, string | null][])
    .run(({ assert }, [versions, range, expected]) => {
      const actual = maxSatisfying(versions, range)
      assert.strictEqual(
        actual,
        expected,
        `maxSatisfying(${JSON.stringify(versions)}, ${range}) should return ${expected}`
      )
    })
})
