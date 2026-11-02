'use strict'

const t = require('tap')
const constants = require('../../internal/constants')

t.match(constants, {
  MAX_LENGTH: Number,
  MAX_SAFE_COMPONENT_LENGTH: Number,
  MAX_SAFE_INTEGER: Number,
  WHITESPACE_CHARACTERS: Array,
  RELEASE_TYPES: Array,
  SEMVER_SPEC_VERSION: String,
}, 'got appropriate data types exported')

t.test('whitespace characters match JavaScript \\s', t => {
  const expected = []
  for (let code = 0; code <= 0xffff; code++) {
    const char = String.fromCharCode(code)
    if (/\s/.test(char)) {
      expected.push(char)
    }
  }
  t.strictSame(constants.WHITESPACE_CHARACTERS, expected)
  t.end()
})
