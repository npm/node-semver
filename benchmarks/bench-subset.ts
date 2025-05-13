/* eslint-disable no-console */
import { Suite, CliReporter, FileReporter, compareSuites } from '@pawel-up/benchmark'
import { getLatestBenchmark, getHistoryPath } from './helper.js'
import subset from '../src/ranges/subset.js'

const latest = await getLatestBenchmark('subset')

const cli = new CliReporter({ format: 'short' })
const file = new FileReporter({ outputDir: getHistoryPath('subset') })
const suite = new Suite('Subset')

// taken from tests
const cases = [
  // everything is a subset of *
  ['1.2.3', '*', true],
  ['^1.2.3', '*', true],
  ['^1.2.3-pre.0', '*', false],
  // ['^1.2.3-pre.0', '*', true, { includePrerelease: true }],
  ['1 || 2 || 3', '*', true],
] as [string, string, boolean][]

for (const [sub, dom] of cases) {
  suite.add(`subset(${sub}, ${dom})`, function () {
    subset(sub, dom)
  })
}

const result = await suite.addReporter(cli, 'after-each').addReporter(file, 'after-all').run()

if (latest) {
  console.log('Comparing with the latest benchmark...')
  compareSuites(result, latest)
} else {
  console.log('No previous benchmark found to compare with.')
}
