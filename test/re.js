var test = require('tap').test
var semver = require('../')

test('has a list of src, re, and safeRe', function (t) {
  semver.re.forEach(function (r) { return t.match(r, RegExp, 'regexps are regexps') })
  semver.src.forEach(function (s) { return t.match(s, String, 'src is strings') })

  semver.safeRe.forEach(function (r) {
    t.notMatch(r.source, '\\s+', 'safe regex do not contain greedy whitespace')
    t.notMatch(r.source, '\\s*', 'safe regex do not contain greedy whitespace')
  })

  t.end()
})
