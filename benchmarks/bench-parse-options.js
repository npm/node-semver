'use strict'

const Benchmark = require('benchmark')
const parseOptions = require('../internal/parse-options')
const suite = new Benchmark.Suite()

const options1 = {
  includePrerelease: true,
}

const options2 = {
  includePrerelease: true,
  loose: true,
}

const options3 = {
  includePrerelease: true,
  loose: true,
  rtl: false,
}

suite
  .add('includePrerelease', function () {
    parseOptions(options1)
  })
  .add('includePrerelease + loose', function () {
    parseOptions(options2)
  })
  .add('includePrerelease + loose + rtl', function () {
    parseOptions(options3)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run({ async: false })
