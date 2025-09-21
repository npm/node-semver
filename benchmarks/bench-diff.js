'use strict'

const Benchmark = require('benchmark')
const diff = require('../functions/diff')
const suite = new Benchmark.Suite()

const cases = [
  ['0.0.1', '0.0.1-pre', 'patch'],
  ['0.0.1', '0.0.1-pre-2', 'patch'],
  ['1.1.0', '1.1.0-pre', 'minor'],
]

for (const [v1, v2] of cases) {
  suite.add(`diff(${v1}, ${v2})`, function () {
    diff(v1, v2)
  })
}

suite
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run({ async: false })
