/* eslint-disable no-console */
import { Suite, CliReporter, FileReporter, compareSuites } from '@pawel-up/benchmark'
import { getLatestBenchmark, getHistoryPath } from './helper.js'
import parseOptions from '../src/internal/parse-options.js'
import type { Options } from '../src/internal/parse-options.js'

const latest = await getLatestBenchmark('parse-options')

const cli = new CliReporter({ format: 'short' })
const file = new FileReporter({ outputDir: getHistoryPath('parse-options') })
const suite = new Suite('Parse Options')

const options1: Options = {
  includePrerelease: true,
}

const options2: Options = {
  includePrerelease: true,
  loose: true,
}

const options3: Options = {
  includePrerelease: true,
  loose: true,
  rtl: false,
}

const result = await suite
  .add('includePrerelease', function () {
    parseOptions(options1)
  })
  .add('includePrerelease + loose', function () {
    parseOptions(options2)
  })
  .add('includePrerelease + loose + rtl', function () {
    parseOptions(options3)
  })
  .addReporter(cli, 'after-each')
  .addReporter(file, 'after-all')
  .run()

if (latest) {
  console.log('Comparing with the latest benchmark...')
  compareSuites(result, latest)
} else {
  console.log('No previous benchmark found to compare with.')
}
