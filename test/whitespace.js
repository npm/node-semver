var test = require('tap').test
var semver = require('../')

var validRange = semver.validRange
var SemVer = semver.SemVer
var Range = semver.Range
var Comparator = semver.Comparator
var minVersion = semver.minVersion
var minSatisfying = semver.minSatisfying
var maxSatisfying = semver.maxSatisfying

function s(n, char) {
  if (!n) {
    n = 500000
  }
  if (!char) {
    char = ' '
  }
  var c = ''
  for (var i = 0; i < n; i++) {
    c += char
  }
  return c
}

test('regex dos via range whitespace', function (t) {
  // a range with this much whitespace would take a few minutes to process if
  // any redos susceptible regexes were used. there is a global tap timeout per
  // file set in the package.json that will error if this test takes too long.
  var r = `1.2.3 ${s()} <1.3.0`

  t.equal(new Range(r).range, '1.2.3 <1.3.0')
  t.equal(validRange(r), '1.2.3 <1.3.0')
  t.equal(minVersion(r).version, '1.2.3')
  t.equal(minSatisfying(['1.2.3'], r), '1.2.3')
  t.equal(maxSatisfying(['1.2.3'], r), '1.2.3')

  t.end()
})

test('range with 0', function (t) {
  var r = `1.2.3 ${s(null, '0')} <1.3.0`
  t.throws(function () { return new Range(r).range })
  t.equal(validRange(r), null)
  t.throws(function () { return minVersion(r).version })
  t.equal(minSatisfying(['1.2.3'], r), null)
  t.equal(maxSatisfying(['1.2.3'], r), null)
  t.end()
})

test('semver version', function (t) {
  var v = `${s(125)}1.2.3${s(125)}`
  var tooLong = `${s()}1.2.3${s()}`
  t.equal(new SemVer(v).version, '1.2.3')
  t.throws(function () { return new SemVer(tooLong) })
  t.end()
})

test('comparator', function (t) {
  var c = `${s()}<${s()}1.2.3${s()}`
  t.equal(new Comparator(c).value, '<1.2.3')
  t.end()
})
