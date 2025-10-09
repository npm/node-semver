'use strict'

const { test } = require('node:test')
const a = require('node:assert')
const { src, re, safeRe, safeSrc } = require('../../internal/re')
const semver = require('../../')

test('Semver itself has a list of src, re, and tokens', () => {
  a.ok(Array.isArray(semver.re))
  a.ok(Array.isArray(semver.src))
  a.equal(typeof semver.tokens, 'object')

  re.forEach(r => a.ok(r instanceof RegExp, 'regexps are regexps'))
  safeRe.forEach(r => a.ok(r instanceof RegExp, 'safe regexps are regexps'))
  src.forEach(s => a.equal(typeof s, 'string', 'src are strings'))
  safeSrc.forEach(s => a.equal(typeof s, 'string', 'safe src are strings'))
  a.ok(Object.keys(semver.tokens).length, 'there are tokens')
  for (const i in semver.tokens) {
    a.equal(typeof semver.tokens[i], 'number', 'tokens are numbers')
  }

  safeRe.forEach(r => {
    a.doesNotMatch(r.source, /\s\+/, 'safe regex do not contain greedy whitespace')
    a.doesNotMatch(r.source, /\s\*/, 'safe regex do not contain greedy whitespace')
  })
})
