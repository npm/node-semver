'use strict'

const { test } = require('tap')
const trimComparatorWhitespace =
  require('../../internal/trim-comparator-whitespace')
const {
  safeRe,
  t: tokens,
  comparatorTrimReplace,
} = require('../../internal/re')

const whitespace = [
  '\t',
  '\n',
  '\v',
  '\f',
  '\r',
  ' ',
  '\u00a0',
  '\u1680',
  '\u2000',
  '\u2001',
  '\u2002',
  '\u2003',
  '\u2004',
  '\u2005',
  '\u2006',
  '\u2007',
  '\u2008',
  '\u2009',
  '\u200a',
  '\u2028',
  '\u2029',
  '\u202f',
  '\u205f',
  '\u3000',
  '\ufeff',
]

const operators = ['', '=', '==', '<', '<=', '>', '>=']
const versions = ['0', '1', '1.2', '1.2.3', 'x', 'X', '*']

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
