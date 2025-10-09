'use strict'

const { test } = require('node:test')
const a = require('node:assert')
const Comparator = require('../../classes/comparator')
const comparatorIntersection = require('../fixtures/comparator-intersection.js')

test('comparator testing', () => {
  const c = new Comparator('>=1.2.3')
  a.ok(c.test('1.2.4'))
  const c2 = new Comparator(c)
  a.ok(c2.test('1.2.4'))
  const c3 = new Comparator(c, true)
  a.ok(c3.test('1.2.4'))
  // test an invalid version, should not throw
  const c4 = new Comparator(c)
  a.ok(!c4.test('not a version string'))
})

test('tostrings', () => {
  a.equal(new Comparator('>= v1.2.3').toString(), '>=1.2.3')
})

test('intersect comparators', async (t) => {
  for (const [c0, c1, expect, includePrerelease] of comparatorIntersection) {
    await t.test(`${c0} ${c1} ${expect}`, () => {
      const comp0 = new Comparator(c0)
      const comp1 = new Comparator(c1)

      a.equal(comp0.intersects(comp1, { includePrerelease }), expect,
        `${c0} intersects ${c1}`)

      a.equal(comp1.intersects(comp0, { includePrerelease }), expect,
        `${c1} intersects ${c0}`)
    })
  }
})

test('intersect demands another comparator', () => {
  const c = new Comparator('>=1.2.3')
  a.throws(() => c.intersects(), new TypeError('a Comparator is required'))
})

test('ANY matches anything', () => {
  const c = new Comparator('')
  a.ok(c.test('1.2.3'), 'ANY matches anything')
  const c1 = new Comparator('>=1.2.3')
  const ANY = Comparator.ANY
  a.ok(c1.test(ANY), 'anything matches ANY')
})

test('invalid comparator parse throws', () => {
  a.throws(() => new Comparator('foo bar baz'),
    new TypeError('Invalid comparator: foo bar baz'))
})

test('= is ignored', () => {
  a.deepEqual(new Comparator('=1.2.3'), new Comparator('1.2.3'))
})
