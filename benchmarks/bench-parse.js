'use strict'

const Benchmark = require('benchmark')
const parse = require('../functions/parse')
const suite = new Benchmark.Suite()

const cases = require(`../test/fixtures/valid-versions`)
const invalidCases = require(`../test/fixtures/invalid-versions`)

for (const test of cases) {
  suite.add(`parse(${test[0]})`, function () {
    parse(test[0])
  })
}

for (const test of invalidCases) {
  suite.add(`invalid parse(${test[0]})`, function () {
    parse(test[0])
  })
}

suite
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run({ async: false })
