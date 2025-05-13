/* eslint-disable no-console */
import { Suite, CliReporter, FileReporter, compareSuites } from '@pawel-up/benchmark'
import { getLatestBenchmark, getHistoryPath } from './helper.js'
import diff from '../src/functions/diff.js'

const latest = await getLatestBenchmark('diff')

const cli = new CliReporter({ format: 'short' })
const file = new FileReporter({ outputDir: getHistoryPath('diff') })
const suite = new Suite('Diff')

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

const result = await suite.addReporter(cli, 'after-each').addReporter(file, 'after-all').run()

if (latest) {
  console.log('Comparing with the latest benchmark...')
  compareSuites(result, latest)
} else {
  console.log('No previous benchmark found to compare with.')
}
