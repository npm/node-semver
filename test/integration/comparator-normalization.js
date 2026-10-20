'use strict'

const { test } = require('tap')
const {
  Range,
  validRange,
  satisfies,
  minVersion,
  minSatisfying,
  maxSatisfying,
} = require('../../')

const options = [
  {},
  { loose: true },
  { includePrerelease: true },
  { loose: true, includePrerelease: true },
]

const checkRange = (t, { input, expected, minimum, versions, matching, opts, raw }) => {
  const range = new Range(input, opts)
  t.equal(range.range, expected, 'Range preserves the comparator set')
  t.equal(validRange(input, opts), expected, 'validRange preserves the comparator set')
  if (raw !== undefined) {
    t.equal(range.raw, raw, 'raw retains metadata and normalizes whitespace')
  }
  for (const version of versions) {
    t.equal(range.test(version), matching.indexOf(version) !== -1, `Range.test(${version})`)
    t.equal(satisfies(version, input, opts), matching.indexOf(version) !== -1,
      `satisfies(${version})`)
  }
  const min = minVersion(input, opts)
  t.equal(min && min.version, minimum, 'minVersion preserves the lower bound')
  t.equal(minSatisfying(versions, input, opts), matching[0] || null, 'minSatisfying')
  t.equal(maxSatisfying(versions, input, opts), matching[matching.length - 1] || null, 'maxSatisfying')
}

test('equality after releases and prereleases', t => {
  const names = ['', 'dev', 'v', 'vv', '1.dev', 'dev.1', 'beta.1', 'preview']
  const metadata = ['', '+build', '+build.1']
  const whitespace = [' ', '  ', '\t', '\n', '\u00a0', '\ufeff']
  let checked = 0

  for (const name of names) {
    for (const build of metadata) {
      for (const ws of whitespace) {
        for (const opts of options) {
          const version = `1.2.3${name ? `-${name}` : ''}`
          const input = `${version}${build}${ws}=${ws}${version}`
          const other = name ? '1.2.3' : '1.2.3-dev'
          t.test(`${JSON.stringify(input)} ${JSON.stringify(opts)}`, t => {
            checkRange(t, {
              input,
              expected: version,
              minimum: version,
              versions: ['1.2.2', version, other, '1.2.4'],
              matching: [version],
              opts,
              raw: `${version}${build} = ${version}`,
            })
            t.end()
          })
          checked++
        }
      }
    }
  }
  t.equal(checked, 576, 'checks every declared combination')
  t.end()
})

test('release comparator sets retain bounds and membership', t => {
  const versions = [
    '0.0.0', '0.2.3', '0.2.4', '0.3.0', '1.0.0', '1.2.2',
    '1.2.3-dev', '1.2.3', '1.2.4', '1.3.0', '1.5.0', '2.0.0',
  ]
  const cases = [
    ['>=\t1.2.3 <\n2.0.0', '>=1.2.3 <2.0.0', '1.2.3',
      ['1.2.3', '1.2.4', '1.3.0', '1.5.0']],
    ['>= 1.2 < 2', '>=1.2.0 <2.0.0-0', '1.2.0',
      ['1.2.2', '1.2.3', '1.2.4', '1.3.0', '1.5.0']],
    ['~ 1.2 >= 1.2.3', '>=1.2.0 <1.3.0-0 >=1.2.3', '1.2.3', ['1.2.3', '1.2.4']],
    ['^ 0.2.3 < 0.3.0', '>=0.2.3 <0.3.0-0 <0.3.0', '0.2.3', ['0.2.3', '0.2.4']],
    ['<= 0.x', '<1.0.0-0', '0.0.0', ['0.0.0', '0.2.3', '0.2.4', '0.3.0']],
    ['> *', '<0.0.0-0', null, []],
    ['>= 2 < 1', '>=2.0.0 <1.0.0-0', null, []],
    ['>= 1.x <= 2.X', '>=1.0.0 <3.0.0-0', '1.0.0',
      ['1.0.0', '1.2.2', '1.2.3', '1.2.4', '1.3.0', '1.5.0', '2.0.0']],
    ['1.2.3+build - 2.0.0+build', '>=1.2.3 <=2.0.0', '1.2.3',
      ['1.2.3', '1.2.4', '1.3.0', '1.5.0', '2.0.0']],
  ]

  for (const [input, expected, minimum, matching] of cases) {
    t.test(JSON.stringify(input), t => {
      checkRange(t, { input, expected, minimum, versions, matching })
      t.end()
    })
  }
  t.end()
})

test('malformed comparator boundaries stay invalid', t => {
  const inputs = [
    '1.2.3-dev= 1',
    '1.2.3-v= x',
    '1.2.3-1.dev= 2.0.0',
    '1.2.3-dev+build= 1',
    '1.2.3= 1',
    '1.2.3-beta.1= 1',
  ]
  const versions = ['0.0.0', '1.2.3-dev', '1.2.3', '1.5.0', '2.0.0']
  for (const input of inputs) {
    for (const opts of options) {
      t.test(`${JSON.stringify(input)} ${JSON.stringify(opts)}`, t => {
        t.throws(() => new Range(input, opts), TypeError, 'Range rejects')
        t.equal(validRange(input, opts), null, 'validRange rejects')
        for (const version of versions) {
          t.notOk(satisfies(version, input, opts), `satisfies(${version}) rejects`)
        }
        t.throws(() => minVersion(input, opts), TypeError, 'minVersion rejects')
        t.equal(minSatisfying(versions, input, opts), null, 'minSatisfying rejects')
        t.equal(maxSatisfying(versions, input, opts), null, 'maxSatisfying rejects')
        t.end()
      })
    }
  }
  t.end()
})

test('invalid loose alternatives cannot widen the range', t => {
  const versions = ['0.0.0', '1.2.3-dev', '1.2.3', '1.5.0', '2.0.0']
  const cases = [
    ['1.2.3-dev || 1.2.3-dev= x', '1.2.3-dev'],
    ['1.2.3-dev= 1 || 2.0.0', '2.0.0'],
    ['1.2.3 || 1.2.3= x', '1.2.3'],
  ]
  for (const includePrerelease of [false, true]) {
    for (const [input, expected] of cases) {
      const opts = { loose: true, includePrerelease }
      t.test(`${JSON.stringify(input)} ${JSON.stringify(opts)}`, t => {
        checkRange(t, {
          input, expected, minimum: expected, versions, matching: [expected], opts,
        })
        t.end()
      })
    }
  }
  t.end()
})

test('invalid comparator errors preserve the normalized input', t => {
  const input = '\t1.2.3-dev=\n1 '
  t.throws(() => new Range(input), TypeError('Invalid comparator: 1.2.3-dev=1'))
  t.throws(() => new Range(input, { loose: true }),
    TypeError('Invalid SemVer Range: 1.2.3-dev= 1'))
  t.end()
})
