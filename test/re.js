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

test('comparator trim regexes stay exported but are not used by range parsing', function (t) {
  var token = semver.tokens.COMPARATORTRIM
  t.type(token, 'number', 'retains the comparator trim token')
  var regexes = [semver.re[token], semver.safeRe[token]]
  regexes.forEach(function (regex) {
    t.equal('> 1.2.3'.replace(regex, '$1$2$3'), '>1.2.3', 'export remains usable')
    regex.exec = function () {
      throw new Error('Range parsing must not execute COMPARATORTRIM')
    }
  })
  var modes = [false, true]
  try {
    modes.forEach(function (loose) {
      modes.forEach(function (includePrerelease) {
        var options = { loose: loose, includePrerelease: includePrerelease }
        t.equal(new semver.Range('>= 1.2.3 < 2.0.0', options).range,
          '>=1.2.3 <2.0.0', 'parses without either regex')
        t.ok(semver.satisfies('1.5.0', '>= 1.2.3 < 2.0.0', options))
      })
    })
  } finally {
    regexes.forEach(function (regex) { delete regex.exec })
  }
  t.end()
})

test('parseRange preserves all whitespace and long-prefix behavior', function (t) {
  var range = new semver.Range('*')
  for (var code = 0; code <= 0xffff; code++) {
    var char = String.fromCharCode(code)
    if (/\s/.test(char)) {
      t.equal(range.parseRange('>' + char + '1.2.3')[0].value, '>1.2.3',
        'trims whitespace code ' + code)
    }
  }
  var prefix = 'v'.repeat(500000)
  t.equal(new semver.Range('>= ' + prefix + '1').range, '>=1.0.0',
    'long valid prefixes retain their meaning')
  t.throws(function () { return new semver.Range(prefix) }, TypeError,
    'long invalid prefixes stay invalid')
  t.end()
})
