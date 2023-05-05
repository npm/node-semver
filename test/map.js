const t = require('tap')

// ensure that the coverage map maps all coverage
const ignore = [
  '.git',
  '.github',
  '.commitlintrc.js',
  '.eslintrc.js',
  '.eslintrc.local.js',
  'node_modules',
  'coverage',
  'tap-snapshots',
  'test',
  'fixtures',
]

const { statSync, readdirSync } = require('fs')
const find = (folder, set = [], root = true) => {
  const ent = readdirSync(folder)
  set.push(...ent.filter(f => !ignore.includes(f) && /\.m?js$/.test(f)).map(f => folder + '/' + f))
  for (const e of ent.filter(f => !ignore.includes(f) && !/\.m?js$/.test(f))) {
    if (statSync(folder + '/' + e).isDirectory()) {
      find(folder + '/' + e, set, false)
    }
  }
  if (!root) {
    return
  }
  return set.map(f => f.slice(folder.length + 1)
    .replace(/\\/g, '/'))
    .sort((a, b) => a.localeCompare(b))
}

const { resolve } = require('path')
const root = resolve(__dirname, '..')

const sut = find(root)
const tests = find(root + '/test')
t.strictSame(sut, tests, 'test files should match system files')
const map = require('../map.js')

for (const testFile of tests) {
  t.test(testFile, t => {
    t.plan(1)
    // cast to an array, since map() can return a string or array
    const systemFiles = [].concat(map(testFile))
    t.ok(systemFiles.some(sys => sut.includes(sys)), 'test covers a file')
  })
}
