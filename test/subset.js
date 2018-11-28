var tap = require('tap')
var test = tap.test
var semver = require('../semver.js')

test('\nsubset test', function (t) {
  // [subset1, subset2, expected,loose]
  [
    ['>=4.0.0', '>=6.0.0', false],
    ['>=6.0.0', '>=4.0.0', true],
    ['>=6.0.0 || 5.0.0', '>=4.0.0', true],
    ['>=6.0.0 || 4.0.0', '>=4.0.0', true],
    ['>=6.0.0 || 4.0.0', '>4.0.0', false],
    ['>=6.0.0', '~4.0.0', false],
    ['~6.0.0', '~6.0.0', true],
    ['5.0.0', '~4.0.0|| ^5.0.0 || ~6.0.0', true],
    ['~5.1.0', '<5.2.0', false],
    ['~5.1.0', '>=5.1.0 || <5.2.0', true],
    ['<=5.0.0', '<5.0.0', false]
  ].forEach(function (tuple) {
    var subset1 = tuple[0]
    var subset2 = tuple[1]
    var expected = tuple[2]
    var loose = tuple[3]
    var result = semver.subset(semver.Range(subset1), semver.Range(subset2), loose)
    t.equal(result, expected)
  })
  t.end()
})
