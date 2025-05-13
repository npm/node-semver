import { test } from '@japa/runner'
import rsort from '../../src/functions/rsort.js'

test.group('rsort function tests', () => {
  test('should correctly sort versions in reverse order')
    .with([
      [
        ['1.2.3+1', '1.2.3+0', '1.2.3', '5.9.6', '0.1.2'],
        ['5.9.6', '1.2.3+1', '1.2.3+0', '1.2.3', '0.1.2'],
      ],
    ])
    .run(({ assert }, [list, expected]) => {
      const result = rsort(list)
      assert.deepEqual(result, expected, `rsort(${JSON.stringify(list)}) should return ${JSON.stringify(expected)}`)
    })
})
