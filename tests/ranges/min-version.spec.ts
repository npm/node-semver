import { test } from '@japa/runner'
import minVersion from '../../src/ranges/min-version.js'

test.group('minimum version in range tests', () => {
  test('should return the minimum version for a given range')
    .with([
      // Stars
      ['*', '0.0.0'],
      ['* || >=2', '0.0.0'],
      ['>=2 || *', '0.0.0'],
      ['>2 || *', '0.0.0'],

      // Equal
      ['1.0.0', '1.0.0'],
      ['1.0', '1.0.0'],
      ['1.0.x', '1.0.0'],
      ['1.0.*', '1.0.0'],
      ['1', '1.0.0'],
      ['1.x.x', '1.0.0'],
      ['1.*.x', '1.0.0'],
      ['1.x.*', '1.0.0'],
      ['1.x', '1.0.0'],
      ['1.*', '1.0.0'],
      ['=1.0.0', '1.0.0'],

      // Tilde
      ['~1.1.1', '1.1.1'],
      ['~1.1.1-beta', '1.1.1-beta'],
      ['~1.1.1 || >=2', '1.1.1'],

      // Caret
      ['^1.1.1', '1.1.1'],
      ['^1.1.1-beta', '1.1.1-beta'],
      ['^1.1.1 || >=2', '1.1.1'],
      ['^2.16.2 ^2.16', '2.16.2'],

      // '-' operator
      ['1.1.1 - 1.8.0', '1.1.1'],
      ['1.1 - 1.8.0', '1.1.0'],

      // Less / less or equal
      ['<2', '0.0.0'],
      ['<0.0.0-beta', '0.0.0-0'],
      ['<0.0.1-beta', '0.0.0'],
      ['<2 || >4', '0.0.0'],
      ['>4 || <2', '0.0.0'],
      ['<=2 || >=4', '0.0.0'],
      ['>=4 || <=2', '0.0.0'],
      ['<0.0.0-beta >0.0.0-alpha', '0.0.0-alpha.0'],
      ['>0.0.0-alpha <0.0.0-beta', '0.0.0-alpha.0'],

      // Greater than or equal
      ['>=1.1.1 <2 || >=2.2.2 <2', '1.1.1'],
      ['>=2.2.2 <2 || >=1.1.1 <2', '1.1.1'],

      // Greater than but not equal
      ['>1.0.0', '1.0.1'],
      ['>1.0.0-0', '1.0.0-0.0'],
      ['>1.0.0-beta', '1.0.0-beta.0'],
      ['>2 || >1.0.0', '1.0.1'],
      ['>2 || >1.0.0-0', '1.0.0-0.0'],
      ['>2 || >1.0.0-beta', '1.0.0-beta.0'],

      // Impossible range
      ['>4 <3', null],
    ] as [string, string | null][])
    .run(({ assert }, [range, expected, loose = false]) => {
      const result = minVersion(range, loose)
      if (expected === null) {
        assert.isNull(result, `minVersion(${range}, ${loose}) should return null`)
      } else {
        assert.strictEqual(result?.version, expected, `minVersion(${range}, ${loose}) should return ${expected}`)
      }
    })
})
