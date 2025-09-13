'use strict'

const Benchmark = require('benchmark')
const invalidVersions = require('../test/fixtures/invalid-versions')
const valid = require('../functions/valid')
const validVersions = require('../test/fixtures/valid-versions')
const suite = new Benchmark.Suite()

const cases = validVersions.map(invalid => invalid[0])
const invalidCases = invalidVersions.map(invalid => invalid[0])

for (const test of cases) {
  suite.add(`valid(${test})`, function () {
    valid(test)
  })
}

for (const test of invalidCases) {
  suite.add(`invalid valid(${test})`, function () {
    valid(test)
  })
}

suite
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run({ async: false })
