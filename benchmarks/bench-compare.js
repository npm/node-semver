const Benchmark = require('benchmark')
const SemVer = require('../classes/semver')
const suite = new Benchmark.Suite()

const versions = ['1.0.3', '2.2.2', '2.3.0']
const versionToCompare = '1.0.2'
const option1 = { includePrelease: true }
const option2 = { includePrelease: true, loose: true }
const option3 = { includePrelease: true, loose: true, rtl: true }

for (const version of versions) {
  suite.add(`compare ${version} to ${versionToCompare}`, function () {
    const semver = new SemVer(version)
    semver.compare(versionToCompare)
  })
}

for (const version of versions) {
  suite.add(
    `compare ${version} to ${versionToCompare} with option (${JSON.stringify(option1)})`,
    function () {
      const semver = new SemVer(version, option1)
      semver.compare(versionToCompare)
    })
}

for (const version of versions) {
  suite.add(`compare ${version} to ${versionToCompare} with option (${JSON.stringify(option2)})`,
    function () {
      const semver = new SemVer(version, option2)
      semver.compare(versionToCompare)
    })
}

for (const version of versions) {
  suite.add(
    `compare ${version} to ${versionToCompare} with option (${JSON.stringify(option3)})`,
    function () {
      const semver = new SemVer(version, option3)
      semver.compare(versionToCompare)
    })
}

suite
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run({ async: false })
