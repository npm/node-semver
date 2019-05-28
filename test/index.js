'use strict'

var tap = require('tap')
var test = tap.test
var semver = require('../semver.js')
var eq = semver.eq
var gt = semver.gt
var lt = semver.lt
var neq = semver.neq
var cmp = semver.cmp
var gte = semver.gte
var lte = semver.lte
var satisfies = semver.satisfies
var validRange = semver.validRange
var inc = semver.inc
var diff = semver.diff
var toComparators = semver.toComparators
var SemVer = semver.SemVer
var Range = semver.Range
var Comparator = semver.Comparator

test('comparison tests', function (t) {
  // [version1, version2]
  // version1 should be greater than version2
  [['0.0.0', '0.0.0-foo'],
    ['0.0.1', '0.0.0'],
    ['1.0.0', '0.9.9'],
    ['0.10.0', '0.9.0'],
    ['0.99.0', '0.10.0', {}],
    ['2.0.0', '1.2.3', { loose: false }],
    ['v0.0.0', '0.0.0-foo', true],
    ['v0.0.1', '0.0.0', { loose: true }],
    ['v1.0.0', '0.9.9', true],
    ['v0.10.0', '0.9.0', true],
    ['v0.99.0', '0.10.0', true],
    ['v2.0.0', '1.2.3', true],
    ['0.0.0', 'v0.0.0-foo', true],
    ['0.0.1', 'v0.0.0', true],
    ['1.0.0', 'v0.9.9', true],
    ['0.10.0', 'v0.9.0', true],
    ['0.99.0', 'v0.10.0', true],
    ['2.0.0', 'v1.2.3', true],
    ['1.2.3', '1.2.3-asdf'],
    ['1.2.3', '1.2.3-4'],
    ['1.2.3', '1.2.3-4-foo'],
    ['1.2.3-5-foo', '1.2.3-5'],
    ['1.2.3-5', '1.2.3-4'],
    ['1.2.3-5-foo', '1.2.3-5-Foo'],
    ['3.0.0', '2.7.2+asdf'],
    ['1.2.3-a.10', '1.2.3-a.5'],
    ['1.2.3-a.b', '1.2.3-a.5'],
    ['1.2.3-a.b', '1.2.3-a'],
    ['1.2.3-a.b.c.10.d.5', '1.2.3-a.b.c.5.d.100'],
    ['1.2.3-r2', '1.2.3-r100'],
    ['1.2.3-r100', '1.2.3-R2'],
  ].forEach(function (v) {
    var v0 = v[0]
    var v1 = v[1]
    var loose = v[2]
    t.ok(gt(v0, v1, loose), "gt('" + v0 + "', '" + v1 + "')")
    t.ok(lt(v1, v0, loose), "lt('" + v1 + "', '" + v0 + "')")
    t.ok(!gt(v1, v0, loose), "!gt('" + v1 + "', '" + v0 + "')")
    t.ok(!lt(v0, v1, loose), "!lt('" + v0 + "', '" + v1 + "')")
    t.ok(eq(v0, v0, loose), "eq('" + v0 + "', '" + v0 + "')")
    t.ok(eq(v1, v1, loose), "eq('" + v1 + "', '" + v1 + "')")
    t.ok(neq(v0, v1, loose), "neq('" + v0 + "', '" + v1 + "')")
    t.ok(cmp(v1, '==', v1, loose), "cmp('" + v1 + "' == '" + v1 + "')")
    t.ok(cmp(v0, '>=', v1, loose), "cmp('" + v0 + "' >= '" + v1 + "')")
    t.ok(cmp(v1, '<=', v0, loose), "cmp('" + v1 + "' <= '" + v0 + "')")
    t.ok(cmp(v0, '!=', v1, loose), "cmp('" + v0 + "' != '" + v1 + "')")
  })
  t.end()
})

test('equality tests', function (t) {
  // [version1, version2]
  // version1 should be equivalent to version2
  [['1.2.3', 'v1.2.3', true],
    ['1.2.3', '=1.2.3', true],
    ['1.2.3', 'v 1.2.3', true],
    ['1.2.3', '= 1.2.3', true],
    ['1.2.3', ' v1.2.3', true],
    ['1.2.3', ' =1.2.3', true],
    ['1.2.3', ' v 1.2.3', true],
    ['1.2.3', ' = 1.2.3', true],
    ['1.2.3-0', 'v1.2.3-0', true],
    ['1.2.3-0', '=1.2.3-0', true],
    ['1.2.3-0', 'v 1.2.3-0', true],
    ['1.2.3-0', '= 1.2.3-0', true],
    ['1.2.3-0', ' v1.2.3-0', true],
    ['1.2.3-0', ' =1.2.3-0', true],
    ['1.2.3-0', ' v 1.2.3-0', true],
    ['1.2.3-0', ' = 1.2.3-0', true],
    ['1.2.3-1', 'v1.2.3-1', true],
    ['1.2.3-1', '=1.2.3-1', true],
    ['1.2.3-1', 'v 1.2.3-1', true],
    ['1.2.3-1', '= 1.2.3-1', true],
    ['1.2.3-1', ' v1.2.3-1', true],
    ['1.2.3-1', ' =1.2.3-1', true],
    ['1.2.3-1', ' v 1.2.3-1', true],
    ['1.2.3-1', ' = 1.2.3-1', true],
    ['1.2.3-beta', 'v1.2.3-beta', true],
    ['1.2.3-beta', '=1.2.3-beta', true],
    ['1.2.3-beta', 'v 1.2.3-beta', true],
    ['1.2.3-beta', '= 1.2.3-beta', true],
    ['1.2.3-beta', ' v1.2.3-beta', true],
    ['1.2.3-beta', ' =1.2.3-beta', true],
    ['1.2.3-beta', ' v 1.2.3-beta', true],
    ['1.2.3-beta', ' = 1.2.3-beta', true],
    ['1.2.3-beta+build', ' = 1.2.3-beta+otherbuild', true],
    ['1.2.3+build', ' = 1.2.3+otherbuild', true],
    ['1.2.3-beta+build', '1.2.3-beta+otherbuild'],
    ['1.2.3+build', '1.2.3+otherbuild'],
    ['  v1.2.3+build', '1.2.3+otherbuild']
  ].forEach(function (v) {
    var v0 = v[0]
    var v1 = v[1]
    var loose = v[2]
    t.ok(eq(v0, v1, loose), "eq('" + v0 + "', '" + v1 + "')")
    t.ok(!neq(v0, v1, loose), "!neq('" + v0 + "', '" + v1 + "')")
    t.ok(cmp(v0, '==', v1, loose), 'cmp(' + v0 + '==' + v1 + ')')
    t.ok(!cmp(v0, '!=', v1, loose), '!cmp(' + v0 + '!=' + v1 + ')')
    t.ok(!cmp(v0, '===', v1, loose), '!cmp(' + v0 + '===' + v1 + ')')

    // also test with an object. they are === because obj.version matches
    t.ok(cmp(new SemVer(v0, { loose: loose }), '===',
      new SemVer(v1, { loose: loose })),
      '!cmp(' + v0 + '===' + v1 + ') object')

    t.ok(cmp(v0, '!==', v1, loose), 'cmp(' + v0 + '!==' + v1 + ')')

    t.ok(!cmp(new SemVer(v0, loose), '!==', new SemVer(v1, loose)),
      'cmp(' + v0 + '!==' + v1 + ') object')

    t.ok(!gt(v0, v1, loose), "!gt('" + v0 + "', '" + v1 + "')")
    t.ok(gte(v0, v1, loose), "gte('" + v0 + "', '" + v1 + "')")
    t.ok(!lt(v0, v1, loose), "!lt('" + v0 + "', '" + v1 + "')")
    t.ok(lte(v0, v1, loose), "lte('" + v0 + "', '" + v1 + "')")
  })
  t.end()
})

test('range tests', function (t) {
  // [range, version]
  // version should be included by range
  [['1.0.0 - 2.0.0', '1.2.3'],
    ['^1.2.3+build', '1.2.3'],
    ['^1.2.3+build', '1.3.0'],
    ['1.2.3-pre+asdf - 2.4.3-pre+asdf', '1.2.3'],
    ['1.2.3pre+asdf - 2.4.3-pre+asdf', '1.2.3', true],
    ['1.2.3-pre+asdf - 2.4.3pre+asdf', '1.2.3', true],
    ['1.2.3pre+asdf - 2.4.3pre+asdf', '1.2.3', true],
    ['1.2.3-pre+asdf - 2.4.3-pre+asdf', '1.2.3-pre.2'],
    ['1.2.3-pre+asdf - 2.4.3-pre+asdf', '2.4.3-alpha'],
    ['1.2.3+asdf - 2.4.3+asdf', '1.2.3'],
    ['1.0.0', '1.0.0'],
    ['>=*', '0.2.4'],
    ['', '1.0.0'],
    ['*', '1.2.3', {}],
    ['*', 'v1.2.3', { loose: 123 }],
    ['>=1.0.0', '1.0.0', /asdf/],
    ['>=1.0.0', '1.0.1', { loose: null }],
    ['>=1.0.0', '1.1.0', { loose: 0 }],
    ['>1.0.0', '1.0.1', { loose: undefined }],
    ['>1.0.0', '1.1.0'],
    ['<=2.0.0', '2.0.0'],
    ['<=2.0.0', '1.9999.9999'],
    ['<=2.0.0', '0.2.9'],
    ['<2.0.0', '1.9999.9999'],
    ['<2.0.0', '0.2.9'],
    ['>= 1.0.0', '1.0.0'],
    ['>=  1.0.0', '1.0.1'],
    ['>=   1.0.0', '1.1.0'],
    ['> 1.0.0', '1.0.1'],
    ['>  1.0.0', '1.1.0'],
    ['<=   2.0.0', '2.0.0'],
    ['<= 2.0.0', '1.9999.9999'],
    ['<=  2.0.0', '0.2.9'],
    ['<    2.0.0', '1.9999.9999'],
    ['<\t2.0.0', '0.2.9'],
    ['>=0.1.97', 'v0.1.97', true],
    ['>=0.1.97', '0.1.97'],
    ['0.1.20 || 1.2.4', '1.2.4'],
    ['>=0.2.3 || <0.0.1', '0.0.0'],
    ['>=0.2.3 || <0.0.1', '0.2.3'],
    ['>=0.2.3 || <0.0.1', '0.2.4'],
    ['||', '1.3.4'],
    ['2.x.x', '2.1.3'],
    ['1.2.x', '1.2.3'],
    ['1.2.x || 2.x', '2.1.3'],
    ['1.2.x || 2.x', '1.2.3'],
    ['x', '1.2.3'],
    ['2.*.*', '2.1.3'],
    ['1.2.*', '1.2.3'],
    ['1.2.* || 2.*', '2.1.3'],
    ['1.2.* || 2.*', '1.2.3'],
    ['*', '1.2.3'],
    ['2', '2.1.2'],
    ['2.3', '2.3.1'],
    ['~0.0.1', '0.0.1'],
    ['~0.0.1', '0.0.2'],
    ['~x', '0.0.9'], // >=2.4.0 <2.5.0
    ['~2', '2.0.9'], // >=2.4.0 <2.5.0
    ['~2.4', '2.4.0'], // >=2.4.0 <2.5.0
    ['~2.4', '2.4.5'],
    ['~>3.2.1', '3.2.2'], // >=3.2.1 <3.3.0,
    ['~1', '1.2.3'], // >=1.0.0 <2.0.0
    ['~>1', '1.2.3'],
    ['~> 1', '1.2.3'],
    ['~1.0', '1.0.2'], // >=1.0.0 <1.1.0,
    ['~ 1.0', '1.0.2'],
    ['~ 1.0.3', '1.0.12'],
    ['~ 1.0.3alpha', '1.0.12', { loose: true }],
    ['>=1', '1.0.0'],
    ['>= 1', '1.0.0'],
    ['<1.2', '1.1.1'],
    ['< 1.2', '1.1.1'],
    ['~v0.5.4-pre', '0.5.5'],
    ['~v0.5.4-pre', '0.5.4'],
    ['=0.7.x', '0.7.2'],
    ['<=0.7.x', '0.7.2'],
    ['>=0.7.x', '0.7.2'],
    ['<=0.7.x', '0.6.2'],
    ['~1.2.1 >=1.2.3', '1.2.3'],
    ['~1.2.1 =1.2.3', '1.2.3'],
    ['~1.2.1 1.2.3', '1.2.3'],
    ['~1.2.1 >=1.2.3 1.2.3', '1.2.3'],
    ['~1.2.1 1.2.3 >=1.2.3', '1.2.3'],
    ['~1.2.1 1.2.3', '1.2.3'],
    ['>=1.2.1 1.2.3', '1.2.3'],
    ['1.2.3 >=1.2.1', '1.2.3'],
    ['>=1.2.3 >=1.2.1', '1.2.3'],
    ['>=1.2.1 >=1.2.3', '1.2.3'],
    ['>=1.2', '1.2.8'],
    ['^1.2.3', '1.8.1'],
    ['^0.1.2', '0.1.2'],
    ['^0.1', '0.1.2'],
    ['^0.0.1', '0.0.1'],
    ['^1.2', '1.4.2'],
    ['^1.2 ^1', '1.4.2'],
    ['^1.2.3-alpha', '1.2.3-pre'],
    ['^1.2.0-alpha', '1.2.0-pre'],
    ['^0.0.1-alpha', '0.0.1-beta'],
    ['^0.0.1-alpha', '0.0.1'],
    ['^0.1.1-alpha', '0.1.1-beta'],
    ['^x', '1.2.3'],
    ['x - 1.0.0', '0.9.7'],
    ['x - 1.x', '0.9.7'],
    ['1.0.0 - x', '1.9.7'],
    ['1.x - x', '1.9.7'],
    ['<=7.x', '7.9.9'],
  ].forEach(function (v) {
    var range = v[0]
    var ver = v[1]
    var loose = v[2]
    t.ok(satisfies(ver, range, loose), range + ' satisfied by ' + ver)
  })
  t.end()
})

test('negative range tests', function (t) {
  // [range, version]
  // version should not be included by range
  [['1.0.0 - 2.0.0', '2.2.3'],
    ['1.2.3+asdf - 2.4.3+asdf', '1.2.3-pre.2'],
    ['1.2.3+asdf - 2.4.3+asdf', '2.4.3-alpha'],
    ['^1.2.3+build', '2.0.0'],
    ['^1.2.3+build', '1.2.0'],
    ['^1.2.3', '1.2.3-pre'],
    ['^1.2', '1.2.0-pre'],
    ['>1.2', '1.3.0-beta'],
    ['<=1.2.3', '1.2.3-beta'],
    ['^1.2.3', '1.2.3-beta'],
    ['=0.7.x', '0.7.0-asdf'],
    ['>=0.7.x', '0.7.0-asdf'],
    ['1', '1.0.0beta', { loose: 420 }],
    ['<1', '1.0.0beta', true],
    ['< 1', '1.0.0beta', true],
    ['1.0.0', '1.0.1'],
    ['>=1.0.0', '0.0.0'],
    ['>=1.0.0', '0.0.1'],
    ['>=1.0.0', '0.1.0'],
    ['>1.0.0', '0.0.1'],
    ['>1.0.0', '0.1.0'],
    ['<=2.0.0', '3.0.0'],
    ['<=2.0.0', '2.9999.9999'],
    ['<=2.0.0', '2.2.9'],
    ['<2.0.0', '2.9999.9999'],
    ['<2.0.0', '2.2.9'],
    ['>=0.1.97', 'v0.1.93', true],
    ['>=0.1.97', '0.1.93'],
    ['0.1.20 || 1.2.4', '1.2.3'],
    ['>=0.2.3 || <0.0.1', '0.0.3'],
    ['>=0.2.3 || <0.0.1', '0.2.2'],
    ['2.x.x', '1.1.3', { loose: NaN }],
    ['2.x.x', '3.1.3'],
    ['1.2.x', '1.3.3'],
    ['1.2.x || 2.x', '3.1.3'],
    ['1.2.x || 2.x', '1.1.3'],
    ['2.*.*', '1.1.3'],
    ['2.*.*', '3.1.3'],
    ['1.2.*', '1.3.3'],
    ['1.2.* || 2.*', '3.1.3'],
    ['1.2.* || 2.*', '1.1.3'],
    ['2', '1.1.2'],
    ['2.3', '2.4.1'],
    ['~0.0.1', '0.1.0-alpha'],
    ['~0.0.1', '0.1.0'],
    ['~2.4', '2.5.0'], // >=2.4.0 <2.5.0
    ['~2.4', '2.3.9'],
    ['~>3.2.1', '3.3.2'], // >=3.2.1 <3.3.0
    ['~>3.2.1', '3.2.0'], // >=3.2.1 <3.3.0
    ['~1', '0.2.3'], // >=1.0.0 <2.0.0
    ['~>1', '2.2.3'],
    ['~1.0', '1.1.0'], // >=1.0.0 <1.1.0
    ['<1', '1.0.0'],
    ['>=1.2', '1.1.1'],
    ['1', '2.0.0beta', true],
    ['~v0.5.4-beta', '0.5.4-alpha'],
    ['=0.7.x', '0.8.2'],
    ['>=0.7.x', '0.6.2'],
    ['<0.7.x', '0.7.2'],
    ['<1.2.3', '1.2.3-beta'],
    ['=1.2.3', '1.2.3-beta'],
    ['>1.2', '1.2.8'],
    ['^0.0.1', '0.0.2-alpha'],
    ['^0.0.1', '0.0.2'],
    ['^1.2.3', '2.0.0-alpha'],
    ['^1.2.3', '1.2.2'],
    ['^1.2', '1.1.9'],
    ['*', 'v1.2.3-foo', true],
    // invalid ranges never satisfied!
    ['blerg', '1.2.3'],
    ['git+https://user:password0123@github.com/foo', '123.0.0', true],
    ['^1.2.3', '2.0.0-pre'],
    ['0.x', undefined],
    ['*', undefined],
  ].forEach(function (v) {
    var range = v[0]
    var ver = v[1]
    var loose = v[2]
    var found = satisfies(ver, range, loose)
    t.ok(!found, ver + ' not satisfied by ' + range)
  })
  t.end()
})

test('unlocked prerelease range tests', function (t) {
  // [range, version]
  // version should be included by range
  [['*', '1.0.0-rc1'],
    ['^1.0.0', '2.0.0-rc1'],
    ['^1.0.0-0', '1.0.1-rc1'],
    ['^1.0.0-rc2', '1.0.1-rc1'],
    ['^1.0.0', '1.0.1-rc1'],
    ['^1.0.0', '1.1.0-rc1']
  ].forEach(function (v) {
    var range = v[0]
    var ver = v[1]
    var options = { includePrerelease: true }
    t.ok(satisfies(ver, range, options), range + ' satisfied by ' + ver)
  })
  t.end()
})

test('negative unlocked prerelease range tests', function (t) {
  // [range, version]
  // version should not be included by range
  [['^1.0.0', '1.0.0-rc1'],
    ['^1.2.3-rc2', '2.0.0']
  ].forEach(function (v) {
    var range = v[0]
    var ver = v[1]
    var options = { includePrerelease: true }
    var found = satisfies(ver, range, options)
    t.ok(!found, ver + ' not satisfied by ' + range)
  })
  t.end()
})

test('increment versions test', function (t) {
//  [version, inc, result, identifier]
//  inc(version, inc) -> result
  [['1.2.3', 'major', '2.0.0'],
    ['1.2.3', 'minor', '1.3.0'],
    ['1.2.3', 'patch', '1.2.4'],
    ['1.2.3tag', 'major', '2.0.0', true],
    ['1.2.3-tag', 'major', '2.0.0'],
    ['1.2.3', 'fake', null],
    ['1.2.0-0', 'patch', '1.2.0'],
    ['fake', 'major', null],
    ['1.2.3-4', 'major', '2.0.0'],
    ['1.2.3-4', 'minor', '1.3.0'],
    ['1.2.3-4', 'patch', '1.2.3'],
    ['1.2.3-alpha.0.beta', 'major', '2.0.0'],
    ['1.2.3-alpha.0.beta', 'minor', '1.3.0'],
    ['1.2.3-alpha.0.beta', 'patch', '1.2.3'],
    ['1.2.4', 'prerelease', '1.2.5-0'],
    ['1.2.3-0', 'prerelease', '1.2.3-1'],
    ['1.2.3-alpha.0', 'prerelease', '1.2.3-alpha.1'],
    ['1.2.3-alpha.1', 'prerelease', '1.2.3-alpha.2'],
    ['1.2.3-alpha.2', 'prerelease', '1.2.3-alpha.3'],
    ['1.2.3-alpha.0.beta', 'prerelease', '1.2.3-alpha.1.beta'],
    ['1.2.3-alpha.1.beta', 'prerelease', '1.2.3-alpha.2.beta'],
    ['1.2.3-alpha.2.beta', 'prerelease', '1.2.3-alpha.3.beta'],
    ['1.2.3-alpha.10.0.beta', 'prerelease', '1.2.3-alpha.10.1.beta'],
    ['1.2.3-alpha.10.1.beta', 'prerelease', '1.2.3-alpha.10.2.beta'],
    ['1.2.3-alpha.10.2.beta', 'prerelease', '1.2.3-alpha.10.3.beta'],
    ['1.2.3-alpha.10.beta.0', 'prerelease', '1.2.3-alpha.10.beta.1'],
    ['1.2.3-alpha.10.beta.1', 'prerelease', '1.2.3-alpha.10.beta.2'],
    ['1.2.3-alpha.10.beta.2', 'prerelease', '1.2.3-alpha.10.beta.3'],
    ['1.2.3-alpha.9.beta', 'prerelease', '1.2.3-alpha.10.beta'],
    ['1.2.3-alpha.10.beta', 'prerelease', '1.2.3-alpha.11.beta'],
    ['1.2.3-alpha.11.beta', 'prerelease', '1.2.3-alpha.12.beta'],
    ['1.2.0', 'prepatch', '1.2.1-0'],
    ['1.2.0-1', 'prepatch', '1.2.1-0'],
    ['1.2.0', 'preminor', '1.3.0-0'],
    ['1.2.3-1', 'preminor', '1.3.0-0'],
    ['1.2.0', 'premajor', '2.0.0-0'],
    ['1.2.3-1', 'premajor', '2.0.0-0'],
    ['1.2.0-1', 'minor', '1.2.0'],
    ['1.0.0-1', 'major', '1.0.0'],

    ['1.2.3', 'major', '2.0.0', false, 'dev'],
    ['1.2.3', 'minor', '1.3.0', false, 'dev'],
    ['1.2.3', 'patch', '1.2.4', false, 'dev'],
    ['1.2.3tag', 'major', '2.0.0', true, 'dev'],
    ['1.2.3-tag', 'major', '2.0.0', false, 'dev'],
    ['1.2.3', 'fake', null, false, 'dev'],
    ['1.2.0-0', 'patch', '1.2.0', false, 'dev'],
    ['fake', 'major', null, false, 'dev'],
    ['1.2.3-4', 'major', '2.0.0', false, 'dev'],
    ['1.2.3-4', 'minor', '1.3.0', false, 'dev'],
    ['1.2.3-4', 'patch', '1.2.3', false, 'dev'],
    ['1.2.3-alpha.0.beta', 'major', '2.0.0', false, 'dev'],
    ['1.2.3-alpha.0.beta', 'minor', '1.3.0', false, 'dev'],
    ['1.2.3-alpha.0.beta', 'patch', '1.2.3', false, 'dev'],
    ['1.2.4', 'prerelease', '1.2.5-dev.0', false, 'dev'],
    ['1.2.3-0', 'prerelease', '1.2.3-dev.0', false, 'dev'],
    ['1.2.3-alpha.0', 'prerelease', '1.2.3-dev.0', false, 'dev'],
    ['1.2.3-alpha.0', 'prerelease', '1.2.3-alpha.1', false, 'alpha'],
    ['1.2.3-alpha.0.beta', 'prerelease', '1.2.3-dev.0', false, 'dev'],
    ['1.2.3-alpha.0.beta', 'prerelease', '1.2.3-alpha.1.beta', false, 'alpha'],
    ['1.2.3-alpha.10.0.beta', 'prerelease', '1.2.3-dev.0', false, 'dev'],
    ['1.2.3-alpha.10.0.beta', 'prerelease', '1.2.3-alpha.10.1.beta', false, 'alpha'],
    ['1.2.3-alpha.10.1.beta', 'prerelease', '1.2.3-alpha.10.2.beta', false, 'alpha'],
    ['1.2.3-alpha.10.2.beta', 'prerelease', '1.2.3-alpha.10.3.beta', false, 'alpha'],
    ['1.2.3-alpha.10.beta.0', 'prerelease', '1.2.3-dev.0', false, 'dev'],
    ['1.2.3-alpha.10.beta.0', 'prerelease', '1.2.3-alpha.10.beta.1', false, 'alpha'],
    ['1.2.3-alpha.10.beta.1', 'prerelease', '1.2.3-alpha.10.beta.2', false, 'alpha'],
    ['1.2.3-alpha.10.beta.2', 'prerelease', '1.2.3-alpha.10.beta.3', false, 'alpha'],
    ['1.2.3-alpha.9.beta', 'prerelease', '1.2.3-dev.0', false, 'dev'],
    ['1.2.3-alpha.9.beta', 'prerelease', '1.2.3-alpha.10.beta', false, 'alpha'],
    ['1.2.3-alpha.10.beta', 'prerelease', '1.2.3-alpha.11.beta', false, 'alpha'],
    ['1.2.3-alpha.11.beta', 'prerelease', '1.2.3-alpha.12.beta', false, 'alpha'],
    ['1.2.0', 'prepatch', '1.2.1-dev.0', false, 'dev'],
    ['1.2.0-1', 'prepatch', '1.2.1-dev.0', false, 'dev'],
    ['1.2.0', 'preminor', '1.3.0-dev.0', false, 'dev'],
    ['1.2.3-1', 'preminor', '1.3.0-dev.0', false, 'dev'],
    ['1.2.0', 'premajor', '2.0.0-dev.0', false, 'dev'],
    ['1.2.3-1', 'premajor', '2.0.0-dev.0', false, 'dev'],
    ['1.2.0-1', 'minor', '1.2.0', false, 'dev'],
    ['1.0.0-1', 'major', '1.0.0', 'dev'],
    ['1.2.3-dev.bar', 'prerelease', '1.2.3-dev.0', false, 'dev']

  ].forEach(function (v) {
    var pre = v[0]
    var what = v[1]
    var wanted = v[2]
    var loose = v[3]
    var id = v[4]
    var found = inc(pre, what, loose, id)
    var cmd = 'inc(' + pre + ', ' + what + ', ' + id + ')'
    t.equal(found, wanted, cmd + ' === ' + wanted)

    var parsed = semver.parse(pre, loose)
    if (wanted) {
      parsed.inc(what, id)
      t.equal(parsed.version, wanted, cmd + ' object version updated')
      t.equal(parsed.raw, wanted, cmd + ' object raw field updated')
    } else if (parsed) {
      t.throws(function () {
        parsed.inc(what, id)
      })
    } else {
      t.equal(parsed, null)
    }
  })

  t.end()
})

test('diff versions test', function (t) {
//  [version1, version2, result]
//  diff(version1, version2) -> result
  [['1.2.3', '0.2.3', 'major'],
    ['1.4.5', '0.2.3', 'major'],
    ['1.2.3', '2.0.0-pre', 'premajor'],
    ['1.2.3', '1.3.3', 'minor'],
    ['1.0.1', '1.1.0-pre', 'preminor'],
    ['1.2.3', '1.2.4', 'patch'],
    ['1.2.3', '1.2.4-pre', 'prepatch'],
    ['0.0.1', '0.0.1-pre', 'prerelease'],
    ['0.0.1', '0.0.1-pre-2', 'prerelease'],
    ['1.1.0', '1.1.0-pre', 'prerelease'],
    ['1.1.0-pre-1', '1.1.0-pre-2', 'prerelease'],
    ['1.0.0', '1.0.0', null]

  ].forEach(function (v) {
    var version1 = v[0]
    var version2 = v[1]
    var wanted = v[2]
    var found = diff(version1, version2)
    var cmd = 'diff(' + version1 + ', ' + version2 + ')'
    t.equal(found, wanted, cmd + ' === ' + wanted)
  })

  t.end()
})

test('valid range test', function (t) {
  // [range, result]
  // validRange(range) -> result
  // translate ranges into their canonical form
  [['1.0.0 - 2.0.0', '>=1.0.0 <=2.0.0'],
    ['1.0.0', '1.0.0'],
    ['>=*', '*'],
    ['', '*'],
    ['*', '*'],
    ['*', '*'],
    ['>=1.0.0', '>=1.0.0'],
    ['>1.0.0', '>1.0.0'],
    ['<=2.0.0', '<=2.0.0'],
    ['1', '>=1.0.0 <2.0.0'],
    ['<=2.0.0', '<=2.0.0'],
    ['<=2.0.0', '<=2.0.0'],
    ['<2.0.0', '<2.0.0'],
    ['<2.0.0', '<2.0.0'],
    ['>= 1.0.0', '>=1.0.0'],
    ['>=  1.0.0', '>=1.0.0'],
    ['>=   1.0.0', '>=1.0.0'],
    ['> 1.0.0', '>1.0.0'],
    ['>  1.0.0', '>1.0.0'],
    ['<=   2.0.0', '<=2.0.0'],
    ['<= 2.0.0', '<=2.0.0'],
    ['<=  2.0.0', '<=2.0.0'],
    ['<    2.0.0', '<2.0.0'],
    ['<\t2.0.0', '<2.0.0'],
    ['>=0.1.97', '>=0.1.97'],
    ['>=0.1.97', '>=0.1.97'],
    ['0.1.20 || 1.2.4', '0.1.20||1.2.4'],
    ['>=0.2.3 || <0.0.1', '>=0.2.3||<0.0.1'],
    ['>=0.2.3 || <0.0.1', '>=0.2.3||<0.0.1'],
    ['>=0.2.3 || <0.0.1', '>=0.2.3||<0.0.1'],
    ['||', '||'],
    ['2.x.x', '>=2.0.0 <3.0.0'],
    ['1.2.x', '>=1.2.0 <1.3.0'],
    ['1.2.x || 2.x', '>=1.2.0 <1.3.0||>=2.0.0 <3.0.0'],
    ['1.2.x || 2.x', '>=1.2.0 <1.3.0||>=2.0.0 <3.0.0'],
    ['x', '*'],
    ['2.*.*', '>=2.0.0 <3.0.0'],
    ['1.2.*', '>=1.2.0 <1.3.0'],
    ['1.2.* || 2.*', '>=1.2.0 <1.3.0||>=2.0.0 <3.0.0'],
    ['*', '*'],
    ['2', '>=2.0.0 <3.0.0'],
    ['2.3', '>=2.3.0 <2.4.0'],
    ['~2.4', '>=2.4.0 <2.5.0'],
    ['~2.4', '>=2.4.0 <2.5.0'],
    ['~>3.2.1', '>=3.2.1 <3.3.0'],
    ['~1', '>=1.0.0 <2.0.0'],
    ['~>1', '>=1.0.0 <2.0.0'],
    ['~> 1', '>=1.0.0 <2.0.0'],
    ['~1.0', '>=1.0.0 <1.1.0'],
    ['~ 1.0', '>=1.0.0 <1.1.0'],
    ['^0', '>=0.0.0 <1.0.0'],
    ['^ 1', '>=1.0.0 <2.0.0'],
    ['^0.1', '>=0.1.0 <0.2.0'],
    ['^1.0', '>=1.0.0 <2.0.0'],
    ['^1.2', '>=1.2.0 <2.0.0'],
    ['^0.0.1', '>=0.0.1 <0.0.2'],
    ['^0.0.1-beta', '>=0.0.1-beta <0.0.2'],
    ['^0.1.2', '>=0.1.2 <0.2.0'],
    ['^1.2.3', '>=1.2.3 <2.0.0'],
    ['^1.2.3-beta.4', '>=1.2.3-beta.4 <2.0.0'],
    ['<1', '<1.0.0'],
    ['< 1', '<1.0.0'],
    ['>=1', '>=1.0.0'],
    ['>= 1', '>=1.0.0'],
    ['<1.2', '<1.2.0'],
    ['< 1.2', '<1.2.0'],
    ['1', '>=1.0.0 <2.0.0'],
    ['>01.02.03', '>1.2.3', true],
    ['>01.02.03', null],
    ['~1.2.3beta', '>=1.2.3-beta <1.3.0', true],
    ['~1.2.3beta', null],
    ['^ 1.2 ^ 1', '>=1.2.0 <2.0.0 >=1.0.0 <2.0.0']
  ].forEach(function (v) {
    var pre = v[0]
    var wanted = v[1]
    var loose = v[2]
    var found = validRange(pre, loose)

    t.equal(found, wanted, 'validRange(' + pre + ') === ' + wanted)
  })

  t.end()
})

test('comparators test', function (t) {
  // [range, comparators]
  // turn range into a set of individual comparators
  [['1.0.0 - 2.0.0', [['>=1.0.0', '<=2.0.0']]],
    ['1.0.0', [['1.0.0']]],
    ['>=*', [['']]],
    ['', [['']]],
    ['*', [['']]],
    ['*', [['']]],
    ['>=1.0.0', [['>=1.0.0']]],
    ['>=1.0.0', [['>=1.0.0']]],
    ['>=1.0.0', [['>=1.0.0']]],
    ['>1.0.0', [['>1.0.0']]],
    ['>1.0.0', [['>1.0.0']]],
    ['<=2.0.0', [['<=2.0.0']]],
    ['1', [['>=1.0.0', '<2.0.0']]],
    ['<=2.0.0', [['<=2.0.0']]],
    ['<=2.0.0', [['<=2.0.0']]],
    ['<2.0.0', [['<2.0.0']]],
    ['<2.0.0', [['<2.0.0']]],
    ['>= 1.0.0', [['>=1.0.0']]],
    ['>=  1.0.0', [['>=1.0.0']]],
    ['>=   1.0.0', [['>=1.0.0']]],
    ['> 1.0.0', [['>1.0.0']]],
    ['>  1.0.0', [['>1.0.0']]],
    ['<=   2.0.0', [['<=2.0.0']]],
    ['<= 2.0.0', [['<=2.0.0']]],
    ['<=  2.0.0', [['<=2.0.0']]],
    ['<    2.0.0', [['<2.0.0']]],
    ['<\t2.0.0', [['<2.0.0']]],
    ['>=0.1.97', [['>=0.1.97']]],
    ['>=0.1.97', [['>=0.1.97']]],
    ['0.1.20 || 1.2.4', [['0.1.20'], ['1.2.4']]],
    ['>=0.2.3 || <0.0.1', [['>=0.2.3'], ['<0.0.1']]],
    ['>=0.2.3 || <0.0.1', [['>=0.2.3'], ['<0.0.1']]],
    ['>=0.2.3 || <0.0.1', [['>=0.2.3'], ['<0.0.1']]],
    ['||', [[''], ['']]],
    ['2.x.x', [['>=2.0.0', '<3.0.0']]],
    ['1.2.x', [['>=1.2.0', '<1.3.0']]],
    ['1.2.x || 2.x', [['>=1.2.0', '<1.3.0'], ['>=2.0.0', '<3.0.0']]],
    ['1.2.x || 2.x', [['>=1.2.0', '<1.3.0'], ['>=2.0.0', '<3.0.0']]],
    ['x', [['']]],
    ['2.*.*', [['>=2.0.0', '<3.0.0']]],
    ['1.2.*', [['>=1.2.0', '<1.3.0']]],
    ['1.2.* || 2.*', [['>=1.2.0', '<1.3.0'], ['>=2.0.0', '<3.0.0']]],
    ['1.2.* || 2.*', [['>=1.2.0', '<1.3.0'], ['>=2.0.0', '<3.0.0']]],
    ['*', [['']]],
    ['2', [['>=2.0.0', '<3.0.0']]],
    ['2.3', [['>=2.3.0', '<2.4.0']]],
    ['~2.4', [['>=2.4.0', '<2.5.0']]],
    ['~2.4', [['>=2.4.0', '<2.5.0']]],
    ['~>3.2.1', [['>=3.2.1', '<3.3.0']]],
    ['~1', [['>=1.0.0', '<2.0.0']]],
    ['~>1', [['>=1.0.0', '<2.0.0']]],
    ['~> 1', [['>=1.0.0', '<2.0.0']]],
    ['~1.0', [['>=1.0.0', '<1.1.0']]],
    ['~ 1.0', [['>=1.0.0', '<1.1.0']]],
    ['~ 1.0.3', [['>=1.0.3', '<1.1.0']]],
    ['~> 1.0.3', [['>=1.0.3', '<1.1.0']]],
    ['<1', [['<1.0.0']]],
    ['< 1', [['<1.0.0']]],
    ['>=1', [['>=1.0.0']]],
    ['>= 1', [['>=1.0.0']]],
    ['<1.2', [['<1.2.0']]],
    ['< 1.2', [['<1.2.0']]],
    ['1', [['>=1.0.0', '<2.0.0']]],
    ['1 2', [['>=1.0.0', '<2.0.0', '>=2.0.0', '<3.0.0']]],
    ['1.2 - 3.4.5', [['>=1.2.0', '<=3.4.5']]],
    ['1.2.3 - 3.4', [['>=1.2.3', '<3.5.0']]],
    ['1.2.3 - 3', [['>=1.2.3', '<4.0.0']]],
    ['>*', [['<0.0.0']]],
    ['<*', [['<0.0.0']]]
  ].forEach(function (v) {
    var pre = v[0]
    var wanted = v[1]
    var found = toComparators(v[0])
    var jw = JSON.stringify(wanted)
    t.equivalent(found, wanted, 'toComparators(' + pre + ') === ' + jw)
  })

  t.end()
})

test('invalid version numbers', function (t) {
  ['1.2.3.4',
    'NOT VALID',
    1.2,
    null,
    'Infinity.NaN.Infinity'
  ].forEach(function (v) {
    t.throws(function () {
      new SemVer(v) // eslint-disable-line no-new
    }, { name: 'TypeError', message: 'Invalid Version: ' + v })
  })

  t.end()
})

test('strict vs loose version numbers', function (t) {
  [['=1.2.3', '1.2.3'],
    ['01.02.03', '1.2.3'],
    ['1.2.3-beta.01', '1.2.3-beta.1'],
    ['   =1.2.3', '1.2.3'],
    ['1.2.3foo', '1.2.3-foo']
  ].forEach(function (v) {
    var loose = v[0]
    var strict = v[1]
    t.throws(function () {
      SemVer(loose) // eslint-disable-line no-new
    })
    var lv = new SemVer(loose, true)
    t.equal(lv.version, strict)
    t.ok(eq(loose, strict, true))
    t.throws(function () {
      eq(loose, strict)
    })
    t.throws(function () {
      new SemVer(strict).compare(loose)
    })
    t.equal(semver.compareLoose(v[0], v[1]), 0)
  })
  t.end()
})

test('compare main vs pre', function (t) {
  var s = new SemVer('1.2.3')
  t.equal(s.compareMain('2.3.4'), -1)
  t.equal(s.compareMain('1.2.4'), -1)
  t.equal(s.compareMain('0.1.2'), 1)
  t.equal(s.compareMain('1.2.2'), 1)
  t.equal(s.compareMain('1.2.3-pre'), 0)

  const p = new SemVer('1.2.3-alpha.0.pr.1')
  t.equal(p.comparePre('9.9.9-alpha.0.pr.1'), 0)
  t.equal(p.comparePre('1.2.3'), -1)
  t.equal(p.comparePre('1.2.3-alpha.0.pr.2'), -1)
  t.equal(p.comparePre('1.2.3-alpha.0.2'), 1)

  t.end()
})

test('compareBuild', function (t) {
  var noBuild = new SemVer('1.0.0')
  var build0 = new SemVer('1.0.0+0')
  var build1 = new SemVer('1.0.0+1')
  var build10 = new SemVer('1.0.0+1.0')
  t.equal(noBuild.compareBuild(build0), -1)
  t.equal(build0.compareBuild(build0), 0)
  t.equal(build0.compareBuild(noBuild), 1)

  t.equal(build0.compareBuild('1.0.0+0.0'), -1)
  t.equal(build0.compareBuild(build1), -1)
  t.equal(build1.compareBuild(build0), 1)
  t.equal(build10.compareBuild(build1), 1)

  t.end()
})

test('rcompare', function (t) {
  t.equal(semver.rcompare('1.0.0', '1.0.1'), 1)
  t.equal(semver.rcompare('1.0.0', '1.0.0'), 0)
  t.equal(semver.rcompare('1.0.0+0', '1.0.0'), 0)
  t.equal(semver.rcompare('1.0.1', '1.0.0'), -1)

  t.end()
})

test('rcompareIdentifiers and compareIdentifiers', function (t) {
  var set = [
    ['1', '2'],
    ['alpha', 'beta'],
    ['0', 'beta'],
  ]
  set.forEach(function (ab) {
    var a = ab[0]
    var b = ab[1]
    t.equal(semver.compareIdentifiers(a, b), -1)
    t.equal(semver.rcompareIdentifiers(a, b), 1)
  })
  t.equal(semver.compareIdentifiers('0', '0'), 0)
  t.equal(semver.rcompareIdentifiers('0', '0'), 0)
  t.end()
})

test('strict vs loose ranges', function (t) {
  [['>=01.02.03', '>=1.2.3'],
    ['~1.02.03beta', '>=1.2.3-beta <1.3.0']
  ].forEach(function (v) {
    var loose = v[0]
    var comps = v[1]
    t.throws(function () {
      new Range(loose) // eslint-disable-line no-new
    })
    t.equal(new Range(loose, true).range, comps)
  })
  t.end()
})

test('max satisfying', function (t) {
  [[['1.2.3', '1.2.4'], '1.2', '1.2.4'],
    [['1.2.4', '1.2.3'], '1.2', '1.2.4'],
    [['1.2.3', '1.2.4', '1.2.5', '1.2.6'], '~1.2.3', '1.2.6'],
    [['1.1.0', '1.2.0', '1.2.1', '1.3.0', '2.0.0b1', '2.0.0b2', '2.0.0b3', '2.0.0', '2.1.0'], '~2.0.0', '2.0.0', true]
  ].forEach(function (v) {
    var versions = v[0]
    var range = v[1]
    var expect = v[2]
    var loose = v[3]
    var actual = semver.maxSatisfying(versions, range, loose)
    t.equal(actual, expect)
  })
  t.end()
})

test('min satisfying', function (t) {
  [[['1.2.3', '1.2.4'], '1.2', '1.2.3'],
    [['1.2.4', '1.2.3'], '1.2', '1.2.3'],
    [['1.2.3', '1.2.4', '1.2.5', '1.2.6'], '~1.2.3', '1.2.3'],
    [['1.1.0', '1.2.0', '1.2.1', '1.3.0', '2.0.0b1', '2.0.0b2', '2.0.0b3', '2.0.0', '2.1.0'], '~2.0.0', '2.0.0', true]
  ].forEach(function (v) {
    var versions = v[0]
    var range = v[1]
    var expect = v[2]
    var loose = v[3]
    var actual = semver.minSatisfying(versions, range, loose)
    t.equal(actual, expect)
  })
  t.end()
})

test('intersect comparators', function (t) {
  [
    // One is a Version
    ['1.3.0', '>=1.3.0', true],
    ['1.3.0', '>1.3.0', false],
    ['>=1.3.0', '1.3.0', true],
    ['>1.3.0', '1.3.0', false],
    // Same direction increasing
    ['>1.3.0', '>1.2.0', true],
    ['>1.2.0', '>1.3.0', true],
    ['>=1.2.0', '>1.3.0', true],
    ['>1.2.0', '>=1.3.0', true],
    // Same direction decreasing
    ['<1.3.0', '<1.2.0', true],
    ['<1.2.0', '<1.3.0', true],
    ['<=1.2.0', '<1.3.0', true],
    ['<1.2.0', '<=1.3.0', true],
    // Different directions, same semver and inclusive operator
    ['>=1.3.0', '<=1.3.0', true],
    ['>=v1.3.0', '<=1.3.0', true],
    ['>=1.3.0', '>=1.3.0', true],
    ['<=1.3.0', '<=1.3.0', true],
    ['<=1.3.0', '<=v1.3.0', true],
    ['>1.3.0', '<=1.3.0', false],
    ['>=1.3.0', '<1.3.0', false],
    // Opposite matching directions
    ['>1.0.0', '<2.0.0', true],
    ['>=1.0.0', '<2.0.0', true],
    ['>=1.0.0', '<=2.0.0', true],
    ['>1.0.0', '<=2.0.0', true],
    ['<=2.0.0', '>1.0.0', true],
    ['<=1.0.0', '>=2.0.0', false]
  ].forEach(function (v) {
    var comparator1 = new Comparator(v[0])
    var comparator2 = new Comparator(v[1])
    var expect = v[2]

    var actual1 = comparator1.intersects(comparator2, false)
    var actual2 = comparator2.intersects(comparator1, { loose: false })
    var actual3 = semver.intersects(comparator1, comparator2)
    var actual4 = semver.intersects(comparator2, comparator1)
    var actual5 = semver.intersects(comparator1, comparator2, true)
    var actual6 = semver.intersects(comparator2, comparator1, true)
    var actual7 = semver.intersects(v[0], v[1])
    var actual8 = semver.intersects(v[1], v[0])
    var actual9 = semver.intersects(v[0], v[1], true)
    var actual10 = semver.intersects(v[1], v[0], true)
    t.equal(actual1, expect)
    t.equal(actual2, expect)
    t.equal(actual3, expect)
    t.equal(actual4, expect)
    t.equal(actual5, expect)
    t.equal(actual6, expect)
    t.equal(actual7, expect)
    t.equal(actual8, expect)
    t.equal(actual9, expect)
    t.equal(actual10, expect)
  })
  t.end()
})

test('missing comparator parameter in intersect comparators', function (t) {
  t.throws(function () {
    new Comparator('>1.0.0').intersects()
  }, new TypeError('a Comparator is required'),
  'throws type error')
  t.end()
})

test('ranges intersect', function (t) {
  [
    ['1.3.0 || <1.0.0 >2.0.0', '1.3.0 || <1.0.0 >2.0.0', true],
    ['<1.0.0 >2.0.0', '>0.0.0', false],
    ['>0.0.0', '<1.0.0 >2.0.0', false],
    ['<1.0.0 >2.0.0', '>1.4.0 <1.6.0', false],
    ['<1.0.0 >2.0.0', '>1.4.0 <1.6.0 || 2.0.0', false],
    ['>1.0.0 <=2.0.0', '2.0.0', true],
    ['<1.0.0 >=2.0.0', '2.1.0', false],
    ['<1.0.0 >=2.0.0', '>1.4.0 <1.6.0 || 2.0.0', false],
    ['1.5.x', '<1.5.0 || >=1.6.0', false],
    ['<1.5.0 || >=1.6.0', '1.5.x', false],
    ['<1.6.16 || >=1.7.0 <1.7.11 || >=1.8.0 <1.8.2', '>=1.6.16 <1.7.0 || >=1.7.11 <1.8.0 || >=1.8.2', false],
    ['<=1.6.16 || >=1.7.0 <1.7.11 || >=1.8.0 <1.8.2', '>=1.6.16 <1.7.0 || >=1.7.11 <1.8.0 || >=1.8.2', true],
    ['>=1.0.0', '<=1.0.0', true],
    ['>1.0.0 <1.0.0', '<=0.0.0', false],
    ['*', '0.0.1', true],
    ['*', '>=1.0.0', true],
    ['*', '>1.0.0', true],
    ['*', '~1.0.0', true],
    ['*', '<1.6.0', true],
    ['*', '<=1.6.0', true],
    ['1.*', '0.0.1', false],
    ['1.*', '2.0.0', false],
    ['1.*', '1.0.0', true],
    ['1.*', '<2.0.0', true],
    ['1.*', '>1.0.0', true],
    ['1.*', '<=1.0.0', true],
    ['1.*', '^1.0.0', true],
    ['1.0.*', '0.0.1', false],
    ['1.0.*', '<0.0.1', false],
    ['1.0.*', '>0.0.1', true],
    ['*', '1.3.0 || <1.0.0 >2.0.0', true],
    ['1.3.0 || <1.0.0 >2.0.0', '*', true],
    ['1.*', '1.3.0 || <1.0.0 >2.0.0', true],
    ['x', '0.0.1', true],
    ['x', '>=1.0.0', true],
    ['x', '>1.0.0', true],
    ['x', '~1.0.0', true],
    ['x', '<1.6.0', true],
    ['x', '<=1.6.0', true],
    ['1.x', '0.0.1', false],
    ['1.x', '2.0.0', false],
    ['1.x', '1.0.0', true],
    ['1.x', '<2.0.0', true],
    ['1.x', '>1.0.0', true],
    ['1.x', '<=1.0.0', true],
    ['1.x', '^1.0.0', true],
    ['1.0.x', '0.0.1', false],
    ['1.0.x', '<0.0.1', false],
    ['1.0.x', '>0.0.1', true],
    ['x', '1.3.0 || <1.0.0 >2.0.0', true],
    ['1.3.0 || <1.0.0 >2.0.0', 'x', true],
    ['1.x', '1.3.0 || <1.0.0 >2.0.0', true],
    ['*', '*', true],
    ['x', '', true],
  ].forEach(function (v) {
    t.test(v[0] + ' <~> ' + v[1], t => {
      var range1 = new Range(v[0])
      var range2 = new Range(v[1])
      var expect = v[2]
      var actual1 = range1.intersects(range2)
      var actual2 = range2.intersects(range1)
      var actual3 = semver.intersects(v[1], v[0])
      var actual4 = semver.intersects(v[0], v[1])
      var actual5 = semver.intersects(v[1], v[0], true)
      var actual6 = semver.intersects(v[0], v[1], true)
      var actual7 = semver.intersects(range1, range2)
      var actual8 = semver.intersects(range2, range1)
      var actual9 = semver.intersects(range1, range2, true)
      var actual0 = semver.intersects(range2, range1, true)
      t.equal(actual1, expect)
      t.equal(actual2, expect)
      t.equal(actual3, expect)
      t.equal(actual4, expect)
      t.equal(actual5, expect)
      t.equal(actual6, expect)
      t.equal(actual7, expect)
      t.equal(actual8, expect)
      t.equal(actual9, expect)
      t.equal(actual0, expect)
      t.end()
    })
  })
  t.end()
})

test('missing range parameter in range intersect', function (t) {
  t.throws(function () {
    new Range('1.0.0').intersects()
  }, new TypeError('a Range is required'),
  'throws type error')
  t.end()
})

test('outside with bad hilo throws', function (t) {
  t.throws(function () {
    semver.outside('1.2.3', '>1.5.0', 'blerg', true)
  }, new TypeError('Must provide a hilo val of "<" or ">"'))
  t.end()
})

test('comparator testing', function (t) {
  var c = new Comparator('>=1.2.3')
  t.ok(c.test('1.2.4'))
  var c2 = new Comparator(c)
  t.ok(c2.test('1.2.4'))
  var c3 = new Comparator(c, true)
  t.ok(c3.test('1.2.4'))
  t.end()
})

test('tostrings', function (t) {
  t.equal(Range('>= v1.2.3').toString(), '>=1.2.3')
  t.equal(Comparator('>= v1.2.3').toString(), '>=1.2.3')
  t.end()
})

test('invalid cmp usage', function (t) {
  t.throws(function () {
    cmp('1.2.3', 'a frog', '4.5.6')
  }, new TypeError('Invalid operator: a frog'))
  t.end()
})

test('sorting', function (t) {
  var list = [
    '1.2.3+1',
    '1.2.3+0',
    '1.2.3',
    '5.9.6',
    '0.1.2'
  ]
  var sorted = [
    '0.1.2',
    '1.2.3',
    '1.2.3+0',
    '1.2.3+1',
    '5.9.6'
  ]
  var rsorted = [
    '5.9.6',
    '1.2.3+1',
    '1.2.3+0',
    '1.2.3',
    '0.1.2'
  ]
  t.same(semver.sort(list), sorted)
  t.same(semver.rsort(list), rsorted)
  t.end()
})

test('bad ranges in max/min satisfying', function (t) {
  var r = 'some frogs and sneks-v2.5.6'
  t.equal(semver.maxSatisfying([], r), null)
  t.equal(semver.minSatisfying([], r), null)
  t.end()
})

test('really big numeric prerelease value', function (t) {
  var r = SemVer('1.2.3-beta.' + Number.MAX_SAFE_INTEGER + '0')
  t.strictSame(r.prerelease, [ 'beta', '90071992547409910' ])
  t.end()
})
