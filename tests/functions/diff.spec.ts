import { test } from '@japa/runner'
import diff from '../../src/functions/diff.js'

test.group('diff function tests', () => {
  test('diff versions test')
    .with([
      ['1.2.3', '0.2.3', 'major'],
      ['0.2.3', '1.2.3', 'major'],
      ['1.4.5', '0.2.3', 'major'],
      ['1.2.3', '2.0.0-pre', 'premajor'],
      ['2.0.0-pre', '1.2.3', 'premajor'],
      ['1.2.3', '1.3.3', 'minor'],
      ['1.0.1', '1.1.0-pre', 'preminor'],
      ['1.2.3', '1.2.4', 'patch'],
      ['1.2.3', '1.2.4-pre', 'prepatch'],
      ['0.0.1', '0.0.1-pre', 'patch'],
      ['0.0.1', '0.0.1-pre-2', 'patch'],
      ['1.1.0', '1.1.0-pre', 'minor'],
      ['1.1.0-pre-1', '1.1.0-pre-2', 'prerelease'],
      ['1.0.0', '1.0.0', null],
      ['1.0.0-1', '1.0.0-1', null],
      ['0.0.2-1', '0.0.2', 'patch'],
      ['0.0.2-1', '0.0.3', 'patch'],
      ['0.0.2-1', '0.1.0', 'minor'],
      ['0.0.2-1', '1.0.0', 'major'],
      ['0.1.0-1', '0.1.0', 'minor'],
      ['1.0.0-1', '1.0.0', 'major'],
      ['1.0.0-1', '1.1.1', 'major'],
      ['1.0.0-1', '2.1.1', 'major'],
      ['1.0.1-1', '1.0.1', 'patch'],
      ['0.0.0-1', '0.0.0', 'major'],
      ['1.0.0-1', '2.0.0', 'major'],
      ['1.0.0-1', '2.0.0-1', 'premajor'],
      ['1.0.0-1', '1.1.0-1', 'preminor'],
      ['1.0.0-1', '1.0.1-1', 'prepatch'],
      ['1.7.2-1', '1.8.1', 'minor'],
      ['1.1.1-pre', '2.1.1-pre', 'premajor'],
      ['1.1.1-pre', '2.1.1', 'major'],
      ['1.2.3-1', '1.2.3', 'patch'],
      ['1.4.0-1', '2.3.5', 'major'],
      ['1.6.1-5', '1.7.2', 'minor'],
      ['2.0.0-1', '2.1.1', 'major'],
    ] as [string, string, string | null][])
    .run(({ assert }, [version1, version2, expected]) => {
      const result = diff(version1, version2)
      assert.strictEqual(result, expected, `diff(${version1}, ${version2}) should return ${expected}`)
    })

  test('throws on bad version', ({ assert }) => {
    assert.throws(
      () => diff('bad', '1.2.3')
      // {
      //   message: 'Invalid Version: bad',
      //   name: 'TypeError',
      // },
      // 'diff("bad", "1.2.3") should throw a TypeError'
    )
  })
})
