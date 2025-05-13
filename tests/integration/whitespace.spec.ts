import { test } from '@japa/runner'
import Range from '../../src/classes/range.js'
import SemVer from '../../src/classes/semver.js'
import Comparator from '../../src/classes/comparator.js'
import validRange from '../../src/ranges/valid.js'
import minVersion from '../../src/ranges/min-version.js'
import minSatisfying from '../../src/ranges/min-satisfying.js'
import maxSatisfying from '../../src/ranges/max-satisfying.js'

const wsMedium = ' '.repeat(125)
const wsLarge = ' '.repeat(500000)
const zeroLarge = '0'.repeat(500000)

test.group('whitespace handling tests', () => {
  test('range with whitespace')
    .with([[`1.2.3 ${wsLarge} <1.3.0`, '1.2.3 <1.3.0', '1.2.3']])
    .run(({ assert }, [range, expectedRange, expectedVersion]) => {
      assert.strictEqual(new Range(range).range, expectedRange)
      assert.strictEqual(validRange(range), expectedRange)
      assert.strictEqual(minVersion(range)!.version, expectedVersion)
      assert.strictEqual(minSatisfying(['1.2.3'], range), expectedVersion)
      assert.strictEqual(maxSatisfying(['1.2.3'], range), expectedVersion)
    })

  test('range with 0')
    .with([[`1.2.3 ${zeroLarge} <1.3.0`]])
    .run(({ assert }, [range]) => {
      assert.throws(() => new Range(range).range)
      assert.isNull(validRange(range))
      assert.throws(() => minVersion(range)!.version)
      assert.isNull(minSatisfying(['1.2.3'], range))
      assert.isNull(maxSatisfying(['1.2.3'], range))
    })

  test('semver version')
    .with([[`${wsMedium}1.2.3${wsMedium}`, '1.2.3'], [`${wsLarge}1.2.3${wsLarge}`]])
    .run(({ assert }, [version, expected]) => {
      if (expected) {
        assert.strictEqual(new SemVer(version).version, expected)
      } else {
        assert.throws(() => new SemVer(version))
      }
    })

  test('comparator')
    .with([[`${wsLarge}<${wsLarge}1.2.3${wsLarge}`, '<1.2.3']])
    .run(({ assert }, [comparator, expected]) => {
      assert.strictEqual(new Comparator(comparator).value, expected)
    })
})
