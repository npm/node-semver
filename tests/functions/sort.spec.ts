import { test } from '@japa/runner'
import sort from '../../src/functions/sort.js'

test.group('sort function tests', () => {
  test('should correctly sort versions')
    .with([
      [
        ['1.2.3+1', '1.2.3+0', '1.2.3', '5.9.6', '0.1.2'],
        ['0.1.2', '1.2.3', '1.2.3+0', '1.2.3+1', '5.9.6'],
      ],
    ])
    .run(({ assert }, [list, expected]) => {
      const result = sort(list)
      assert.deepEqual(result, expected, `sort(${JSON.stringify(list)}) should return ${JSON.stringify(expected)}`)
    })
})
