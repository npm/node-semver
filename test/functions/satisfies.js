'use strict'

const { test } = require('tap')
const satisfies = require('../../functions/satisfies')
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

test('loose caret ranges treat leading-zero components numerically', t => {
  // '^0.2.3' is documented as equivalent to 0.2.x, and '00.2.3' parses to
  // the same version as '0.2.3' in loose mode, so both caret ranges must
  // cap at <0.3.0-0 instead of <1.0.0-0.
  const cases = [
    ['0.2.9', '^00.2.3', true],
    ['0.3.0', '^00.2.3', false],
    ['0.5.0', '^00.2.3', false],
    ['0.2.9', '^00.2.x', true],
    ['0.3.0', '^00.2.x', false],
    ['0.0.3', '^0.00.3', true],
    ['0.0.4', '^0.00.3', false],
    ['0.0.9', '^0.00.3', false],
    ['0.0.3', '^00.00.3-beta.1', true],
    ['0.0.4', '^00.00.3-beta.1', false],
  ]
  t.plan(cases.length)
  cases.forEach(([ver, range, expected]) =>
    t.equal(satisfies(ver, range, { loose: true }), expected,
      `${range} ${expected ? 'satisfied' : 'not satisfied'} by ${ver}`))
})
