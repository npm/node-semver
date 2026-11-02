'use strict'

const { test } = require('tap')
const { src, re, safeRe, safeSrc, t: tokens, comparatorTrimReplace } = require('../../internal/re')
const semver = require('../../')

test('Semver itself has a list of src, re, and tokens', (t) => {
  t.match(Object.assign({}, semver), {
    re: Array,
    src: Array,
    tokens: Object,
  })
  re.forEach(r => t.match(r, RegExp, 'regexps are regexps'))
  safeRe.forEach(r => t.match(r, RegExp, 'safe regexps are regexps'))
  src.forEach(s => t.match(s, String, 'src are strings'))
  safeSrc.forEach(s => t.match(s, String, 'safe srcare strings'))
  t.ok(Object.keys(semver.tokens).length, 'there are tokens')
  for (const i in semver.tokens) {
    t.match(semver.tokens[i], Number, 'tokens are numbers')
  }

  safeRe.forEach(r => {
    t.notMatch(r.source, '\\s+', 'safe regex do not contain greedy whitespace')
    t.notMatch(r.source, '\\s*', 'safe regex do not contain greedy whitespace')
  })

  t.end()
})

test('comparator trim regexes stay exported but are not used by range parsing', t => {
  const token = tokens.COMPARATORTRIM
  t.equal(semver.tokens.COMPARATORTRIM, token, 'retains the public token')
  t.equal(semver.re[token], re[token], 'retains the public regex')
  t.equal(semver.src[token], src[token], 'retains the public source')
  t.equal(comparatorTrimReplace, '$1$2$3', 'retains the replacement export')
  const regexes = [re[token], safeRe[token]]
  for (const regex of regexes) {
    t.equal('> 1.2.3'.replace(regex, comparatorTrimReplace), '>1.2.3', 'export remains usable')
    regex.exec = () => {
      throw new Error('Range parsing must not execute COMPARATORTRIM')
    }
  }
  try {
    for (const loose of [false, true]) {
      for (const includePrerelease of [false, true]) {
        const options = { loose, includePrerelease }
        t.equal(new semver.Range('>= 1.2.3 < 2.0.0', options).range,
          '>=1.2.3 <2.0.0', 'parses without either regex')
        t.ok(semver.satisfies('1.5.0', '>= 1.2.3 < 2.0.0', options))
      }
    }
  } finally {
    for (const regex of regexes) {
      delete regex.exec
    }
  }
  t.end()
})
