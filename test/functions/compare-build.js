'use strict'

const { test } = require('tap')
const compareBuild = require('../../functions/compare-build')
const sort = require('../../functions/sort')
const rsort = require('../../functions/rsort')

test('compareBuild', (t) => {
  const noBuild = '1.0.0'
  const build0 = '1.0.0+0'
  const build1 = '1.0.0+1'
  const build10 = '1.0.0+1.0'
  t.equal(compareBuild(noBuild, build0), -1)
  t.equal(compareBuild(build0, build0), 0)
  t.equal(compareBuild(build0, noBuild), 1)

  t.equal(compareBuild(build0, '1.0.0+0.0'), -1)
  t.equal(compareBuild(build0, build1), -1)
  t.equal(compareBuild(build1, build0), 1)
  t.equal(compareBuild(build10, build1), 1)

  t.end()
})

// Build identifiers may contain leading zeroes. Numeric ties must not hide
// later identifiers, or comparison equality stops being transitive.
test('compareBuild continues after numerically equal build identifiers', t => {
  const cases = [
    ['1', '01', 0],
    ['1', '01.0', -1],
    ['01', '01.0', -1],
    ['01.2', '1.3', -1],
    ['1.3', '01.2', 1],
    ['0.2', '00.2', 0],
    ['000.2.a', '0.2.b', -1],
    ['1.0', '01.0.0', -1],
    ['1.a', '01.2', 1],
  ]
  for (const [a, b, expected] of cases) {
    const left = `1.0.0+${a}`
    const right = `1.0.0+${b}`
    t.equal(compareBuild(left, right), expected, `${a} vs ${b}`)
    t.equal(compareBuild(right, left), expected === 0 ? 0 : -expected,
      `${b} vs ${a}`)
  }
  t.equal(compareBuild('1.0.0+1', '2.0.0+01.0'), -1,
    'release precedence still wins over build metadata')
  t.equal(compareBuild('1.0.0-alpha+01.0', '1.0.0-beta+1'), -1,
    'prerelease precedence still wins over build metadata')
  t.end()
})

test('sorting build identifiers after numeric ties', t => {
  const groups = [
    ['1.0.0+1', '1.0.0+01'],
    ['1.0.0+1.0', '1.0.0+01.0'],
    ['1.0.0+1.1', '1.0.0+001.1'],
  ]
  const permutations = values => values.length === 0 ? [[]]
    : values.reduce((result, v, i) => result.concat(
      permutations(values.filter((_, j) => j !== i))
        .map(tail => [v, ...tail])), [])
  for (const indices of permutations([0, 1, 2])) {
    const input = indices.reduce((result, i) => result.concat(groups[i]), [])
    const original = input.slice()
    t.equal(sort(input), input, 'sort still returns and mutates the input array')
    t.same(input, [].concat(...groups), `group order for ${indices.join(',')}`)
    t.same(original.filter(v => groups[0].includes(v)), input.slice(0, 2),
      'numeric ties retain their input order')
    const descending = original.slice()
    t.equal(rsort(descending), descending, 'rsort mutates the input array')
    t.same(descending, [].concat(...groups.slice().reverse()),
      'rsort reverses group order while keeping numeric ties stable')
  }
  t.end()
})
