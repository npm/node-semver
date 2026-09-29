'use strict'

const { test } = require('tap')
const satisfies = require('../../functions/satisfies')
const Comparator = require('../../classes/comparator')
const rangeInclude = require('../fixtures/range-include.js')
const rangeExclude = require('../fixtures/range-exclude.js')
test('range tests', t => {
  t.plan(rangeInclude.length)
  rangeInclude.forEach(([range, ver, options]) =>
    t.ok(satisfies(ver, range, options), `${range} satisfied by ${ver}`))
})

test('negative range tests', t => {
  t.plan(rangeExclude.length)
  rangeExclude.forEach(([range, ver, options]) =>
    t.notOk(satisfies(ver, range, options), `${range} not satisfied by ${ver}`))
})

test('invalid ranges never satisfied (but do not throw)', t => {
  const cases = [
    ['blerg', '1.2.3'],
    ['git+https://user:password0123@github.com/foo', '123.0.0', true],
    ['^1.2.3', '2.0.0-pre'],
    ['0.x', undefined],
    ['*', undefined],
  ]
  t.plan(cases.length)
  cases.forEach(([range, ver]) =>
    t.notOk(satisfies(ver, range), `${range} not satisfied because invalid`))
})

test('Comparator range argument can test a prerelease version', t => {
  t.equal(
    satisfies('1.0.0-beta', new Comparator('>=1.0.0-alpha')),
    true,
    'does not throw when the range is a Comparator'
  )
  t.end()
})
