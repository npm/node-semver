var tap = require('tap')
var test = tap.test
var semver = require('../')

test('\nminimum version in range tests', function (t) {
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
  ].forEach(function (tuple) {
    var range = tuple[0]
    var version = tuple[1]
    var loose = tuple[2] || false
    var msg = 'minVersion(' + range + ', ' + loose + ') = ' + version
    var min = semver.minVersion(range, loose)
    t.ok(min === version || (min && min.version === version), msg)
  })
  t.end()
})
