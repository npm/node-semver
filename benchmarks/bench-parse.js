const Benchmark = require('benchmark')
const parse = require('../functions/parse')
const { MAX_SAFE_INTEGER } = require('../internal/constants')
const suite = new Benchmark.Suite()

const cases = ['1.2.1', '1.2.2-4', '1.2.3-pre']
const invalidCases = [`${MAX_SAFE_INTEGER}0.0.0`, 'hello, world', 'xyz']

for (const test of cases) {
  suite.add(`parse(${test})`, function () {
    parse(test)
  })
}

for (const test of invalidCases) {
  suite.add(`invalid parse(${test})`, function () {
    parse(test)
  })
}

suite
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run({ async: false })
