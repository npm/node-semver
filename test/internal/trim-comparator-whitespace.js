'use strict'

const { test } = require('tap')
const trimComparatorWhitespace =
  require('../../internal/trim-comparator-whitespace')
const rangeParse = require('../fixtures/range-parse')
const {
  safeRe,
  t: tokens,
  comparatorTrimReplace,
} = require('../../internal/re')
const {
  MAX_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  WHITESPACE_CHARACTERS: whitespace,
} = require('../../internal/constants')

const operators = ['', '=', '==', '<', '<=', '>', '>=']
const versions = [
  '0', '1', '1.2', '1.2.3', 'x', 'X', '*',
  '0.0.0-928490632884417731e7af463c92b034d6a78268fc993bcb88a57944',
  `1.2.3-${'9'.repeat(MAX_LENGTH - '1.2.3-a'.length)}a`,
]

test('matches legacy comparator trimming for range fixtures', t => {
  const inputs = new Set(rangeParse.map(([range]) => range.trim().replace(/\s+/g, ' ')))
  for (const range of inputs) {
    t.equal(trimComparatorWhitespace(range),
      range.replace(safeRe[tokens.COMPARATORTRIM], comparatorTrimReplace),
      JSON.stringify(range))
  }
  t.end()
})

test('removes operator whitespace without rewriting version prefixes', t => {
  const cases = [
    [' > 1', ' >1'],
    ['>= vvv1', '>=vvv1'],
    ['>= v = 1', '>=v = 1'],
    ['v = 1', 'v = 1'],
    ['= = 1', '== 1'],
    ['> = 1', '>= 1'],
    ['> invalid', '> invalid'],
  ]
  for (const [input, expected] of cases) {
    t.equal(trimComparatorWhitespace(input), expected, JSON.stringify(input))
  }
  t.end()
})

test('matches comparator trim behavior', t => {
  const mismatches = []
  let checked = 0

  for (const ws of whitespace) {
    const prefixCharacters = ['v', '=', ws]
    const prefixes = ['', 'vvv', '===', 'v=v']

    for (const first of prefixCharacters) {
      prefixes.push(first)
      for (const second of prefixCharacters) {
        prefixes.push(first + second)
      }
    }

    for (const operator of operators) {
      for (const prefix of prefixes) {
        for (const version of versions) {
          const inputs = [
            `${operator}${ws}${prefix}${version}`,
            `${ws}${operator}${ws}${prefix}${version}`,
            `1.2.3${ws}${operator}${ws}${prefix}${version}`,
            `${operator}${ws}${prefix}${version}${ws}<${ws}2.0.0`,
          ]

          for (const input of inputs) {
            const expected = input.replace(
              safeRe[tokens.COMPARATORTRIM],
              comparatorTrimReplace
            )
            const actual = trimComparatorWhitespace(input)
            checked++
            if (actual !== expected && mismatches.length < 20) {
              mismatches.push({ input, expected, actual })
            }
          }
        }
      }
    }
  }

  t.strictSame(mismatches, [], `matches ${checked} bounded legacy cases`)
  t.end()
})

test('preserves the preceding regex match boundary', t => {
  const inputs = [
    '1.2.3 = 1.2.3',
    '1.2.3-dev = 1.2.3-dev',
    '1.2.3-vv = 1.2',
    '1.2.3-1.dev = x',
    '1.2.3-dev.1 = 1.2.3-dev.1',
    '1.2.3-dev= 1',
    '1.2.3dev = 1.2.3',
    '1.2.3-dev+build = 1.2.3-dev',
    '1.2.3-dev  = 1.2.3-dev',
    '1.2.3-dev   1.2.3',
    '1.2.3-dev = 1.2.3-dev = 1.2.3-dev',
    '1.2.3-dev || 1.2.3-dev= x',
    '^1.2.3-dev = 1.2.3-dev < 2.0.0',
    '< >= 1.2.3',
    'vvv< 1.2.3',
    'v v v',
    '= = =',
    '>vvv',
  ]
  for (const input of inputs) {
    t.equal(trimComparatorWhitespace(input),
      input.replace(safeRe[tokens.COMPARATORTRIM], comparatorTrimReplace),
      JSON.stringify(input))
  }
  t.end()
})

test('preserves partial versions and bounded identifier fragments', t => {
  const fragments = [
    'x.x.x',
    'x.x.x-',
    'x.x.x-01.2',
    'x.x.x-a+build',
    '1.2.3-',
    '1.2.3-A',
    '1.2.3-a.',
    '1.2.3+',
    '1.2.3+build.more',
    '1.2.3+build.',
    '1..2',
    '1.2.',
  ]
  for (const length of [MAX_LENGTH - 1, MAX_LENGTH, MAX_LENGTH + 1, MAX_LENGTH + 2]) {
    const digits = '9'.repeat(length)
    fragments.push(`${digits}.1.2-v`, `1.2.3-${digits}v`, `x.x.x-${digits}v`)
  }
  for (const length of [
    MAX_SAFE_BUILD_LENGTH - 1,
    MAX_SAFE_BUILD_LENGTH,
    MAX_SAFE_BUILD_LENGTH + 1,
    MAX_SAFE_BUILD_LENGTH + 2,
  ]) {
    const identifier = 'v'.repeat(length)
    fragments.push(`1.2.3-${identifier}`, `1.2.3+${identifier}`, `x.x.x-${identifier}`)
  }
  for (const version of fragments) {
    const input = `> ${version} = 1.2.3`
    t.equal(trimComparatorWhitespace(input),
      input.replace(safeRe[tokens.COMPARATORTRIM], comparatorTrimReplace),
      JSON.stringify(input))
  }
  t.end()
})

test('skips long prefixes without retrying overlapping suffixes', t => {
  const prefix = 'v= '.repeat(100000)
  for (const operator of ['', '<', '>']) {
    const input = `${operator} ${prefix}invalid`
    t.equal(trimComparatorWhitespace(input), input, 'invalid prefix is unchanged')
  }
  t.equal(trimComparatorWhitespace(`> ${prefix}1`), `>${prefix}1`,
    'a long valid prefix retains its internal whitespace')
  t.equal(trimComparatorWhitespace(`${prefix}< 1.2.3`), `${prefix}<1.2.3`,
    'an invalid prefix does not hide a later comparator')
  t.end()
})

test('digit-run lookahead does not repeatedly read overlapping suffixes', t => {
  const failedVersion = `${'0'.repeat(MAX_LENGTH)}.1.x `
  const inputs = [
    '0'.repeat(4096),
    `${failedVersion.repeat(16)}< 1.2.3`,
  ]
  for (const input of inputs) {
    let reads = 0
    // Count character accesses instead of relying on machine-dependent timings.
    const observed = new Proxy({
      length: input.length,
      slice: (start, end) => input.slice(start, end),
    }, {
      get: (target, property) => {
        if (typeof property === 'string' && /^\d+$/.test(property)) {
          reads++
          return input[property]
        }
        return Reflect.get(target, property)
      },
    })
    t.equal(trimComparatorWhitespace(observed),
      input.replace(safeRe[tokens.COMPARATORTRIM], comparatorTrimReplace),
      'cached lookahead preserves legacy match boundaries')
    t.ok(reads <= input.length * 40,
      `${reads} character reads stay within the linear budget for ${input.length} characters`)
  }
  t.end()
})

test('does not share regex iteration state', t => {
  const regex = safeRe[tokens.COMPARATORTRIM]
  const previous = regex.lastIndex
  regex.lastIndex = 3
  t.equal(trimComparatorWhitespace('> 1.2.3'), '>1.2.3')
  t.equal(regex.lastIndex, 3, 'leaves the shared regex unchanged')
  regex.lastIndex = previous
  t.equal(trimComparatorWhitespace('< 2.0.0'), '<2.0.0',
    'repeated calls start scanning from the beginning')
  t.end()
})
