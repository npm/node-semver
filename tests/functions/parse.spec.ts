import { test } from '@japa/runner'
import parse from '../../src/functions/parse.js'
import SemVer from '../../src/classes/semver.js'
import invalidVersions from '../fixtures/invalid-versions.js'

test.group('parse function tests', () => {
  test('returns null instead of throwing when presented with garbage')
    .with(invalidVersions)
    .run(({ assert }, [v, msg, opts]) => {
      const result = parse(v as string, opts)
      assert.isNull(result, msg)
    })

  test('throws errors if asked to', ({ assert }) => {
    assert.throws(
      // @ts-expect-error Force invalid type
      () => parse('bad', null, true)
      // {
      //   name: 'TypeError',
      //   message: 'Invalid Version: bad',
      // },
      // 'parse("bad", null, true) should throw a TypeError'
    )

    assert.throws(
      // @ts-expect-error Force invalid type
      () => parse([], null, true)
      // {
      //   name: 'TypeError',
      //   message: 'Invalid version. Must be a string. Got type "object".',
      // },
      // 'parse([], null, true) should throw a TypeError'
    )
  })

  test('parses a version into a SemVer object', ({ assert }) => {
    const parsed = parse('1.2.3')
    assert.deepEqual(parsed, new SemVer('1.2.3'), 'parse("1.2.3") should return a SemVer object')

    const semVerObj = new SemVer('4.5.6')
    assert.strictEqual(parse(semVerObj), semVerObj, 'parse should return the same SemVer object if passed one')

    const looseSemVer = new SemVer('4.2.0', { loose: true })
    assert.deepEqual(parse('4.2.0', true), looseSemVer, 'parse("4.2.0", true) should return a loose SemVer object')
    assert.deepEqual(
      parse('4.2.0', { loose: true }),
      looseSemVer,
      'parse("4.2.0", { loose: true }) should return a loose SemVer object'
    )
  })
})
