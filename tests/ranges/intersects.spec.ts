import { test } from '@japa/runner'
import intersects from '../../src/ranges/intersects.js'
import Range from '../../src/classes/range.js'
import Comparator from '../../src/classes/comparator.js'
import comparatorIntersection from '../fixtures/comparator-intersection.js'
import rangeIntersection from '../fixtures/range-intersection.js'

test.group('intersects function tests', () => {
  test('intersect comparators')
    .with(comparatorIntersection)
    .run(({ assert }, [c0, c1, expect, includePrerelease]) => {
      const opts = { loose: false, includePrerelease }
      const comp0 = new Comparator(c0)
      const comp1 = new Comparator(c1)

      assert.strictEqual(intersects(comp0, comp1, opts), expect, `${c0} intersects ${c1} objects`)
      assert.strictEqual(intersects(comp1, comp0, opts), expect, `${c1} intersects ${c0} objects`)
      assert.strictEqual(intersects(c0, c1, opts), expect, `${c0} intersects ${c1}`)
      assert.strictEqual(intersects(c1, c0, opts), expect, `${c1} intersects ${c0}`)

      opts.loose = true
      assert.strictEqual(intersects(comp0, comp1, opts), expect, `${c0} intersects ${c1} loose, objects`)
      assert.strictEqual(intersects(comp1, comp0, opts), expect, `${c1} intersects ${c0} loose, objects`)
      assert.strictEqual(intersects(c0, c1, opts), expect, `${c0} intersects ${c1} loose`)
      assert.strictEqual(intersects(c1, c0, opts), expect, `${c1} intersects ${c0} loose`)
    })

  test('ranges intersect')
    .with(rangeIntersection)
    .run(({ assert }, [r0, r1, expect]) => {
      const range0 = new Range(r0)
      const range1 = new Range(r1)

      assert.strictEqual(intersects(r1, r0), expect, `${r0} <~> ${r1}`)
      assert.strictEqual(intersects(r0, r1), expect, `${r1} <~> ${r0}`)
      assert.strictEqual(intersects(r1, r0, true), expect, `${r0} <~> ${r1} loose`)
      assert.strictEqual(intersects(r0, r1, true), expect, `${r1} <~> ${r0} loose`)
      assert.strictEqual(intersects(range0, range1), expect, `${r0} <~> ${r1} objects`)
      assert.strictEqual(intersects(range1, range0), expect, `${r1} <~> ${r0} objects`)
      assert.strictEqual(intersects(range0, range1, true), expect, `${r0} <~> ${r1} objects loose`)
      assert.strictEqual(intersects(range1, range0, true), expect, `${r1} <~> ${r0} objects loose`)
    })

  test('missing comparator parameter in intersect comparators', ({ assert }) => {
    assert.throws(
      () => {
        // @ts-expect-error For testing purposes
        new Comparator('>1.0.0').intersects()
      }
      // new TypeError('a Comparator is required'),
      // 'throws type error'
    )
  })
})
