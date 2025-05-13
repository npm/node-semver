import { test } from '@japa/runner'
import validRange from '../../src/ranges/valid.js'
import rangeParse from '../fixtures/range-parse.js'

test.group('valid range tests', () => {
  test('should translate ranges into their canonical form')
    .with(rangeParse)
    .run(({ assert }, [pre, wanted, options]) => {
      const result = validRange(pre, options)
      assert.strictEqual(result, wanted, `validRange(${pre}) === ${wanted} ${JSON.stringify(options)}`)
    })
})
