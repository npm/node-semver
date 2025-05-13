import { test } from '@japa/runner'
import Comparator from '../../src/classes/comparator.js'
import comparatorIntersection from '../fixtures/comparator-intersection.js'

test('comparator testing', ({ assert }) => {
  const c = new Comparator('>=1.2.3')
  assert.ok(c.test('1.2.4'))
  const c2 = new Comparator(c)
  assert.ok(c2.test('1.2.4'))
  const c3 = new Comparator(c, true)
  assert.ok(c3.test('1.2.4'))
  // test an invalid version, should not throw
  const c4 = new Comparator(c)
  assert.notOk(c4.test('not a version string'))
})

test('toString', ({ assert }) => {
  assert.equal(new Comparator('>= v1.2.3').toString(), '>=1.2.3')
})

test('intersect comparators #{$i}')
  .with(comparatorIntersection)
  .run(({ assert }, [c0, c1, expect, includePrerelease]) => {
    const comp0 = new Comparator(c0)
    const comp1 = new Comparator(c1)
    assert.equal(comp0.intersects(comp1, { includePrerelease }), expect, `${c0} intersects ${c1}`)
    assert.equal(comp1.intersects(comp0, { includePrerelease }), expect, `${c1} intersects ${c0}`)
  })

test('intersect demands another comparator', ({ assert }) => {
  const c = new Comparator('>=1.2.3')
  assert.throws(() => {
    // @ts-expect-error For testing purposes
    c.intersects()
  }, 'a Comparator is required')
})

test('ANY matches anything', ({ assert }) => {
  const c = new Comparator('')
  assert.ok(c.test('1.2.3'), 'ANY matches anything')
  const c1 = new Comparator('>=1.2.3')
  const ANY = Comparator.ANY
  assert.ok(c1.test(ANY), 'anything matches ANY')
})

test('invalid comparator parse throws', ({ assert }) => {
  assert.throws(() => new Comparator('foo bar baz'), 'Invalid comparator: foo bar baz')
})

test('= is ignored', ({ assert }) => {
  assert.deepEqual(new Comparator('=1.2.3'), new Comparator('1.2.3'))
})
