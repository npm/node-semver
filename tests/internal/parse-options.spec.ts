import { test } from '@japa/runner'
import parseOptions from '../../src/internal/parse-options.js'

test.group('parseOptions function tests', () => {
  test('falsey values always return an empty options object')
    .with([null, false, undefined, 0, '', undefined])
    .run(({ assert }, input) => {
      const result = parseOptions(input)
      assert.deepEqual(result, {}, `parseOptions(${input}) should return an empty object`)
    })

  test('truthy non-objects always return loose mode for backwards compatibility')
    .with(['hello', true, 1])
    .run(({ assert }, input) => {
      const result = parseOptions(input)
      assert.deepEqual(result, { loose: true }, `parseOptions(${input}) should return { loose: true }`)
    })

  test('any object passed is returned as-is')
    .with([
      [/asdf/, /asdf/],
      [new Error('hello'), new Error('hello')],
      [
        { loose: true, a: 1, rtl: false },
        { loose: true, a: 1, rtl: false },
      ],
      [
        { loose: 1, rtl: 2, includePrerelease: 10 },
        { loose: 1, rtl: 2, includePrerelease: 10 },
      ],
      [{ loose: true }, { loose: true }],
      [{ rtl: true }, { rtl: true }],
      [{ includePrerelease: true }, { includePrerelease: true }],
      [
        { loose: true, rtl: true },
        { loose: true, rtl: true },
      ],
      [
        { loose: true, includePrerelease: true },
        { loose: true, includePrerelease: true },
      ],
      [
        { rtl: true, includePrerelease: true },
        { rtl: true, includePrerelease: true },
      ],
    ])
    .run(({ assert }, [input, expected]) => {
      const result = parseOptions(input)
      assert.deepEqual(
        result,
        expected,
        `parseOptions(${JSON.stringify(input)}) should return ${JSON.stringify(expected)}`
      )
    })
})
