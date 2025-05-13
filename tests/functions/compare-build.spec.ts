import { test } from '@japa/runner'
import compareBuild from '../../src/functions/compare-build.js'

test.group('compareBuild function tests', () => {
  test('should correctly compare versions with build metadata')
    .with([
      ['1.0.0', '1.0.0+0', -1],
      ['1.0.0+0', '1.0.0+0', 0],
      ['1.0.0+0', '1.0.0', 1],
      ['1.0.0+0', '1.0.0+0.0', -1],
      ['1.0.0+0', '1.0.0+1', -1],
      ['1.0.0+1', '1.0.0+0', 1],
      ['1.0.0+1.0', '1.0.0+1', 1],
    ] as [string, string, number][])
    .run(({ assert }, [versionA, versionB, expected]) => {
      const result = compareBuild(versionA, versionB)
      assert.strictEqual(result, expected, `compareBuild(${versionA}, ${versionB}) should return ${expected}`)
    })
})
