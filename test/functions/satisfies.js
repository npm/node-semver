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

test('comparator ranges', t => {
  const range = new Comparator('>=1.2.3-alpha')
  t.ok(satisfies('1.2.3-beta', range), 'accepts a prerelease with the same version tuple')
  t.notOk(satisfies('1.2.4-beta', range), 'excludes other prereleases by default')
  t.ok(satisfies('1.2.4-beta', range, { includePrerelease: true }),
    'includes other prereleases when requested')
  t.notOk(satisfies('not a version', range), 'rejects invalid versions without throwing')
  t.end()
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
