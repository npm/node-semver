const t = require('tap')
const { resolve, join, relative, extname, dirname, basename } = require('path')
const { statSync, readdirSync } = require('fs')
const map = require('../map.js')
const pkg = require('../package.json')

const ROOT = resolve(__dirname, '..')
const TEST = join(ROOT, 'test')
const IGNORE_DIRS = ['fixtures', 'integration']

const getFile = (f) => {
  try {
    if (statSync(f).isFile()) {
      return extname(f) === '.js' ? [f] : []
    }
  } catch {
    return []
  }
}

const walk = (item, res = []) => getFile(item) || readdirSync(item)
  .map(f => join(item, f))
  .reduce((acc, f) => acc.concat(statSync(f).isDirectory() ? walk(f, res) : getFile(f)), [])
  .filter(Boolean)

const walkAll = (items, relativeTo) => items
  .reduce((acc, f) => acc.concat(walk(join(ROOT, f))), [])
  .map((f) => relative(relativeTo, f))
  .sort()

t.test('tests match system', t => {
  const sut = walkAll([pkg.tap['coverage-map'], ...pkg.files], ROOT)
  const tests = walkAll([basename(TEST)], TEST)
    .filter(f => !IGNORE_DIRS.includes(dirname(f)))

  t.strictSame(sut, tests, 'test files should match system files')

  for (const f of tests) {
    t.test(f, t => {
      t.plan(1)
      t.ok(sut.includes(map(f)), 'test covers a file')
    })
  }

  t.end()
})
