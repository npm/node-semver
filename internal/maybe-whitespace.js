'use strict'

// Cheap, conservative pre-check shared by the hot paths that normalize
// whitespace. Every character that `\s` matches is <= 0x20 or >= 0xa0, so a
// string without such a character cannot contain whitespace and callers can
// skip the slower trim/regex work. It may report false positives (ordinary
// letters such as "é" are >= 0xa0): callers must still run the exact
// normalization when it answers true.
const isMaybeWhitespaceCode = code => code <= 32 || code >= 0xa0

const hasMaybeWhitespace = str => {
  for (let i = 0; i < str.length; i++) {
    if (isMaybeWhitespaceCode(str.charCodeAt(i))) {
      return true
    }
  }
  return false
}

module.exports = { isMaybeWhitespaceCode, hasMaybeWhitespace }
