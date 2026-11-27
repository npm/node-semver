'use strict'

const { test } = require('tap')
const { isMaybeWhitespaceCode, hasMaybeWhitespace } = require('../../internal/maybe-whitespace')
const { WHITESPACE_CHARACTERS } = require('../../internal/constants')

test('every character matched by \\s is reported as maybe-whitespace', t => {
  const missed = [...WHITESPACE_CHARACTERS].filter(char =>
    !isMaybeWhitespaceCode(char.charCodeAt(0)) || !hasMaybeWhitespace(`1${char}2`))
  t.same(missed, [])
  t.end()
})

test('plain ascii without whitespace or control characters', t => {
  t.notOk(hasMaybeWhitespace(''))
  t.notOk(hasMaybeWhitespace('>=1.2.3-alpha.1+build~^*xX||'))
  t.ok(isMaybeWhitespaceCode(0), 'control characters are conservative hits')
  t.ok(isMaybeWhitespaceCode(0xe9), 'non-ascii letters are conservative hits')
  t.notOk(isMaybeWhitespaceCode(33))
  t.notOk(isMaybeWhitespaceCode(0x7f))
  t.notOk(isMaybeWhitespaceCode(0x9f))
  t.end()
})
