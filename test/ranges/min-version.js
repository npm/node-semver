'use strict'

const { test } = require('tap')
const minVersion = require('../../ranges/min-version')

test('minimum version in range tests', (t) => {
  // [range, minimum, loose or options]
  [
    // Stars
    ['*', '0.0.0'],
    ['* || >=2', '0.0.0'],
    ['>=2 || *', '0.0.0'],
    ['>2 || *', '0.0.0'],

    // equal
    ['1.0.0', '1.0.0'],
    ['1.0', '1.0.0'],
    ['1.0.x', '1.0.0'],
    ['1.0.*', '1.0.0'],
    ['1', '1.0.0'],
    ['1.x.x', '1.0.0'],
    ['1.x.x', '1.0.0'],
    ['1.*.x', '1.0.0'],
    ['1.x.*', '1.0.0'],
    ['1.x', '1.0.0'],
    ['1.*', '1.0.0'],
    ['=1.0.0', '1.0.0'],

    // Tilde
    ['~1.1.1', '1.1.1'],
    ['~1.1.1-beta', '1.1.1-beta'],
    ['~1.1.1 || >=2', '1.1.1'],

    // Caret
    ['^1.1.1', '1.1.1'],
    ['^1.1.1-beta', '1.1.1-beta'],
    ['^1.1.1 || >=2', '1.1.1'],
    ['^2.16.2 ^2.16', '2.16.2'],

    // '-' operator
    ['1.1.1 - 1.8.0', '1.1.1'],
    ['1.1 - 1.8.0', '1.1.0'],

    // Less / less or equal
    ['<2', '0.0.0'],
    ['<0.0.0-beta', '0.0.0-0'],
    ['<0.0.1-beta', '0.0.0'],
    ['<2 || >4', '0.0.0'],
    ['>4 || <2', '0.0.0'],
    ['<=2 || >=4', '0.0.0'],
    ['>=4 || <=2', '0.0.0'],
    ['<0.0.0-beta >0.0.0-alpha', '0.0.0-alpha.0'],
    ['>0.0.0-alpha <0.0.0-beta', '0.0.0-alpha.0'],

    // Greater than or equal
    ['>=1.1.1 <2 || >=2.2.2 <2', '1.1.1'],
    ['>=2.2.2 <2 || >=1.1.1 <2', '1.1.1'],

    // Greater than but not equal
    ['>1.0.0', '1.0.1'],
    ['>1.0.0-0', '1.0.0-0.0'],
    ['>1.0.0-beta', '1.0.0-beta.0'],
    ['>2 || >1.0.0', '1.0.1'],
    ['>2 || >1.0.0-0', '1.0.0-0.0'],
    ['>2 || >1.0.0-beta', '1.0.0-beta.0'],

    // Prerelease lower bound on 0.0.0
    ['>=0.0.0-alpha <1.0.0', '0.0.0-alpha'],
    ['>=0.0.0-0', '0.0.0-0'],
    ['>0.0.0-alpha', '0.0.0-alpha.0'],
    ['<1 || >=0.0.0-beta', '0.0.0-beta'],
    ['>=0.0.0-beta <0.0.0-alpha || <1', '0.0.0'],
    // an impossible set in a union does not hide the other set's minimum
    ['>=0.0.0-alpha <0.0.0-alpha || >=0.0.0-beta', '0.0.0-beta'],
    ['>=1.0.0 <1.0.0 || >=2.0.0', '2.0.0'],
    // the release after a '>' bound fails the set, but its first prerelease does not
    ['>=1.0.1-0 <1.0.0 || >1.0.0 <1.0.1-alpha', '1.0.1-0'],
    ['>=1.0.1-0 <1.0.0 || >1.0.0 <1.0.1-alpha', '1.0.1-0', true],
    ['>=1.0.1-0 <1.0.0 || >1.0.0 <1.0.1-alpha', '1.0.1-0', { includePrerelease: true }],
    // the next prerelease of a bound at the 256-character limit cannot be written
    [`>0.0.0-${'a'.repeat(249)}`, '0.0.0'],
    [`>0.0.0-${'a'.repeat(249)}`, '0.0.0', true],
    [`>0.0.0-${'a'.repeat(249)}`, '0.0.0', { includePrerelease: true }],
    [`>1.2.3-${'a'.repeat(249)}`, '1.2.3'],
    [`>0.0.0-${'a'.repeat(248)}`, `0.0.0-${'a'.repeat(248)}.0`],
    [`>0.0.0-${'a'.repeat(248)}`, `0.0.0-${'a'.repeat(248)}.0`, true],
    [`>0.0.0-${'a'.repeat(248)}`, `0.0.0-${'a'.repeat(248)}.0`, { includePrerelease: true }],
    ['>=0.0.0', '0.0.0'],

    // includePrerelease
    ['*', '0.0.0-0', { includePrerelease: true }],
    ['<2', '0.0.0-0', { includePrerelease: true }],
    ['>=0.0.0-alpha <1.0.0', '0.0.0-alpha', { includePrerelease: true }],
    ['>1.0.0', '1.0.1-0', { includePrerelease: true }],

    // Impossible range
    ['>4 <3', null],
  ].forEach((tuple) => {
    const range = tuple[0]
    const version = tuple[1]
    const loose = tuple[2] || false
    const msg = `minVersion(${range}, ${JSON.stringify(loose)}) = ${version}`
    const min = minVersion(range, loose)
    t.ok(min === version || (min && min.version === version), msg, {
      found: min,
      wanted: version,
    })
  })
  t.end()
})
