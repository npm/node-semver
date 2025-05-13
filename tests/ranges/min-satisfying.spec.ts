import { test } from '@japa/runner'
import minSatisfying from '../../src/ranges/min-satisfying.js'

test.group('min satisfying tests', () => {
  test('min satisfying versions')
    .with([
      [['1.2.3', '1.2.4'], '1.2', '1.2.3'],
      [['1.2.4', '1.2.3'], '1.2', '1.2.3'],
      [['1.2.3', '1.2.4', '1.2.5', '1.2.6'], '~1.2.3', '1.2.3'],
      [
        ['1.1.0', '1.2.0', '1.2.1', '1.3.0', '2.0.0b1', '2.0.0b2', '2.0.0b3', '2.0.0', '2.1.0'],
        '~2.0.0',
        '2.0.0',
        true,
      ],
    ] as [string[], string, string, boolean?][])
    .run(({ assert }, [versions, range, expected, loose = false]) => {
      const actual = minSatisfying(versions, range, loose)
      assert.strictEqual(
        actual,
        expected,
        `minSatisfying(${JSON.stringify(versions)}, ${range}, ${loose}) should return ${expected}`
      )
    })

  test('bad ranges in min satisfying')
    .with([[[], 'some frogs and sneks-v2.5.6', null]] as [string[], string, string | null][])
    .run(({ assert }, [versions, range, expected]) => {
      const actual = minSatisfying(versions, range)
      assert.strictEqual(
        actual,
        expected,
        `minSatisfying(${JSON.stringify(versions)}, ${range}) should return ${expected}`
      )
    })
})
