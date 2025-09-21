'use strict'

const Benchmark = require('benchmark')
const satisfies = require('../functions/satisfies')
const suite = new Benchmark.Suite()

const versions = ['1.0.3||^2.0.0', '2.2.2||~3.0.0', '2.3.0||<4.0.0']
const versionToCompare = '1.0.6'
const option1 = { includePrelease: true }
const option2 = { includePrelease: true, loose: true }
const option3 = { includePrelease: true, loose: true, rtl: true }

for (const version of versions) {
  suite.add(`satisfies(${versionToCompare}, ${version})`, function () {
    satisfies(versionToCompare, version)
  })
}

for (const version of versions) {
  suite.add(`satisfies(${versionToCompare}, ${version}, ${JSON.stringify(option1)})`, function () {
    satisfies(versionToCompare, version, option1)
  })
}

for (const version of versions) {
  suite.add(`satisfies(${versionToCompare}, ${version}, ${JSON.stringify(option2)})`, function () {
    satisfies(versionToCompare, version, option2)
  })
}

for (const version of versions) {
  suite.add(`satisfies(${versionToCompare}, ${version}, ${JSON.stringify(option3)})`, function () {
    satisfies(versionToCompare, version, option3)
  })
}

suite
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run({ async: false })
