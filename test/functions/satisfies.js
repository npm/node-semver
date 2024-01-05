const t = require('node:test')
const a = require('node:assert')

const satisfies = require('../../functions/satisfies')
const rangeInclude = require('../fixtures/range-include.js')
const rangeExclude = require('../fixtures/range-exclude.js')

t.test('range tests', t => {
  for (const [range, ver, options] of rangeInclude) {
    a.ok(satisfies(ver, range, options), `${range} satisfied by ${ver}`)
  }
})

t.test('negative range tests', t => {
  for (const [range, ver, options] of rangeExclude) {
    a.ok(!satisfies(ver, range, options), `${range} not satisfied by ${ver}`)
  }
})

t.test('invalid ranges never satisfied (but do not throw)', t => {
  const cases = [
    ['blerg', '1.2.3'],
    ['git+https://user:password0123@github.com/foo', '123.0.0', true],
    ['^1.2.3', '2.0.0-pre'],
    ['0.x', undefined],
    ['*', undefined],
  ]
  for (const [range, ver] of cases) {
    a.ok(!satisfies(ver, range), `${range} not satisfied because invalid`)
  }
})
