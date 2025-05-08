'use strict'

const Benchmark = require('benchmark')
const subset = require('../ranges/subset')
const suite = new Benchmark.Suite()

// taken from tests
const cases = [
  // everything is a subset of *
  ['1.2.3', '*', true],
  ['^1.2.3', '*', true],
  ['^1.2.3-pre.0', '*', false],
  ['^1.2.3-pre.0', '*', true, { includePrerelease: true }],
  ['1 || 2 || 3', '*', true],
]

for (const [sub, dom] of cases) {
  suite.add(`subset(${sub}, ${dom})`, function () {
    subset(sub, dom)
  })
}

suite
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run({ async: false })
