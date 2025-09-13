'use strict'

const Benchmark = require('benchmark')
const invalidVersions = require('../test/fixtures/invalid-versions')
const inc = require('../functions/inc')
const validVersions = require('../test/fixtures/valid-versions')
const suite = new Benchmark.Suite()

const cases = validVersions.map(invalid => invalid[0])
const invalidCases = invalidVersions.map(invalid => invalid[0])

for (const test of cases) {
  suite.add(`inc(${test})`, function () {
    inc(test, 'release')
  })
}

for (const test of invalidCases) {
  suite.add(`invalid inc(${test})`, function () {
    inc(test, 'release')
  })
}

suite
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run({ async: false })
