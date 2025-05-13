/* eslint-disable no-console */
import { Suite, CliReporter, FileReporter, compareSuites } from '@pawel-up/benchmark'
import { getLatestBenchmark, getHistoryPath } from './helper.js'
import SemVer from '../src/classes/semver.js'
import type { Options } from '../src/internal/parse-options.js'

const latest = await getLatestBenchmark('compare')

const cli = new CliReporter({ format: 'short' })
const file = new FileReporter({ outputDir: getHistoryPath('compare') })
const suite = new Suite('Compare')

const versions = ['1.0.3', '2.2.2', '2.3.0']
const versionToCompare = '1.0.2'
const option1: Options = { includePrerelease: true }
const option2: Options = { includePrerelease: true, loose: true }
const option3: Options = { includePrerelease: true, loose: true, rtl: true }

for (const version of versions) {
  suite.add(`compare ${version} to ${versionToCompare}`, function () {
    const semver = new SemVer(version)
    semver.compare(versionToCompare)
  })
}

for (const version of versions) {
  suite.add(`compare ${version} to ${versionToCompare} with option (${JSON.stringify(option1)})`, function () {
    const semver = new SemVer(version, option1)
    semver.compare(versionToCompare)
  })
}

for (const version of versions) {
  suite.add(`compare ${version} to ${versionToCompare} with option (${JSON.stringify(option2)})`, function () {
    const semver = new SemVer(version, option2)
    semver.compare(versionToCompare)
  })
}

for (const version of versions) {
  suite.add(`compare ${version} to ${versionToCompare} with option (${JSON.stringify(option3)})`, function () {
    const semver = new SemVer(version, option3)
    semver.compare(versionToCompare)
  })
}

const result = await suite.addReporter(cli, 'after-each').addReporter(file, 'after-all').run()

if (latest) {
  console.log('Comparing with the latest benchmark...')
  compareSuites(result, latest)
} else {
  console.log('No previous benchmark found to compare with.')
}
