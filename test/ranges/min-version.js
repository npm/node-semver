const { test } = require('tap')
const minVersion = require('../../ranges/min-version')

test('minimum version in range tests', (t) => {
  // [range, minimum, loose]
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

    // Carot
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

    // Impossible range
    ['>4 <3', null]
  ].forEach((tuple) => {
    const range = tuple[0]
    const version = tuple[1]
    const loose = tuple[2] || false
    const msg = `minVersion(${range}, ${loose}) = ${version}`
    const min = minVersion(range, loose)
    t.ok(min === version || (min && min.version === version), msg, {
      found: min,
      wanted: version,
    })
  })
  t.end()
})
