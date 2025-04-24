'use strict'

const { test } = require('tap')
const { src, re, safeRe, safeSrc } = require('../../internal/re')
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
