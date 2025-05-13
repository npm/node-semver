/* eslint-disable no-console */
import { Suite, CliReporter, FileReporter, compareSuites } from '@pawel-up/benchmark'
import { getLatestBenchmark, getHistoryPath } from './helper.js'
import parse from '../src/functions/parse.js'
import { MAX_SAFE_INTEGER } from '../src/internal/constants.js'

const latest = await getLatestBenchmark('parse')

const cli = new CliReporter({ format: 'short' })
const file = new FileReporter({ outputDir: getHistoryPath('parse') })
const suite = new Suite('Parse')

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

const result = await suite.addReporter(cli, 'after-each').addReporter(file, 'after-all').run()

if (latest) {
  console.log('Comparing with the latest benchmark...')
  compareSuites(result, latest)
} else {
  console.log('No previous benchmark found to compare with.')
}
