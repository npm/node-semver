import { test } from '@japa/runner'
import valid from '../../src/functions/valid.js'
import SemVer from '../../src/classes/semver.js'
import invalidVersions from '../fixtures/invalid-versions.js'
import { MAX_SAFE_INTEGER } from '../../src/internal/constants.js'

test.group('valid function tests', () => {
  test('returns null instead of throwing when presented with garbage')
    .with(invalidVersions)
    .run(({ assert }, [v, msg, opts]) => {
      const result = valid(v as string, opts)
      assert.isNull(result, msg)
    })

  test('validate a version into a SemVer object', ({ assert }) => {
    assert.strictEqual(valid('1.2.3'), '1.2.3', 'valid("1.2.3") should return "1.2.3"')
    const s = new SemVer('4.5.6')
    assert.strictEqual(valid(s), '4.5.6', 'valid(SemVer("4.5.6")) should return "4.5.6"')
    assert.strictEqual(valid('4.2.0foo', true), '4.2.0-foo', 'valid("4.2.0foo", true) should return "4.2.0-foo"')
    assert.strictEqual(
      valid('4.2.0foo', { loose: true }),
      '4.2.0-foo',
      'valid("4.2.0foo", { loose: true }) should return "4.2.0-foo"'
    )
  })

  test('long build id')
    .with([
      [
        `1.1.1-928490632884417731e7af463c92b034d6a78268fc993bcb88a57944`,
        `1.1.1-928490632884417731e7af463c92b034d6a78268fc993bcb88a57944`,
      ],
      [
        `${MAX_SAFE_INTEGER}.${MAX_SAFE_INTEGER}.${MAX_SAFE_INTEGER}-928490632884417731e7af463c92b034d6a78268fc993bcb88a57944`,
        `${MAX_SAFE_INTEGER}.${MAX_SAFE_INTEGER}.${MAX_SAFE_INTEGER}-928490632884417731e7af463c92b034d6a78268fc993bcb88a57944`,
      ],
    ])
    .run(({ assert }, [input, expected]) => {
      const result = valid(input)
      assert.strictEqual(result, expected, `valid(${input}) should return ${expected}`)
    })
})
