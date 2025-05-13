/* eslint-disable no-console */
import { Suite, CliReporter, FileReporter, compareSuites } from '@pawel-up/benchmark'
import { getLatestBenchmark, getHistoryPath } from './helper.js'
import satisfies from '../src/functions/satisfies.js'
import type { Options } from '../src/internal/parse-options.js'

const latest = await getLatestBenchmark('satisfied')

const cli = new CliReporter({ format: 'short' })
const file = new FileReporter({ outputDir: getHistoryPath('satisfied') })
const suite = new Suite('Satisfied')

const versions = ['1.0.3||^2.0.0', '2.2.2||~3.0.0', '2.3.0||<4.0.0']
const versionToCompare = '1.0.6'
const option1: Options = { includePrerelease: true }
const option2: Options = { includePrerelease: true, loose: true }
const option3: Options = { includePrerelease: true, loose: true, rtl: true }

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

const result = await suite.addReporter(cli, 'after-each').addReporter(file, 'after-all').run()

if (latest) {
  console.log('Comparing with the latest benchmark...')
  compareSuites(result, latest)
} else {
  console.log('No previous benchmark found to compare with.')
}
