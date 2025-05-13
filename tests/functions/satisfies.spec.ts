import { test } from '@japa/runner'
import satisfies from '../../src/functions/satisfies.js'
import rangeInclude from '../fixtures/range-include.js'
import rangeExclude from '../fixtures/range-exclude.js'

test.group('satisfies function tests', () => {
  test('range tests')
    .with(rangeInclude)
    .run(({ assert }, [range, ver, options]) => {
      assert.isTrue(satisfies(ver, range, options), `${range} satisfied by ${ver}`)
    })

  test('negative range tests')
    .with(rangeExclude)
    .run(({ assert }, [range, ver, options]) => {
      assert.isFalse(satisfies(ver, range, options), `${range} not satisfied by ${ver}`)
    })

  test('invalid ranges never satisfied (but do not throw)')
    .with([
      ['blerg', '1.2.3'],
      ['git+https://user:password0123@github.com/foo', '123.0.0', true],
      ['^1.2.3', '2.0.0-pre'],
      ['0.x', undefined],
      ['*', undefined],
    ] as [string, string | undefined, boolean?][])
    .run(({ assert }, [range, ver]) => {
      assert.isFalse(satisfies(ver as string, range), `${range} not satisfied because invalid`)
    })
})
