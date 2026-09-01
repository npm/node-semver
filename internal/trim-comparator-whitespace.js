'use strict'

const isWhitespace = char => {
  const code = char && char.charCodeAt(0)
  return (
    (code >= 0x0009 && code <= 0x000d) ||
    code === 0x0020 ||
    code === 0x00a0 ||
    code === 0x1680 ||
    (code >= 0x2000 && code <= 0x200a) ||
    code === 0x2028 ||
    code === 0x2029 ||
    code === 0x202f ||
    code === 0x205f ||
    code === 0x3000 ||
    code === 0xfeff
  )
}

const isVersionPrefix = char =>
  char === 'v' ||
  char === '=' ||
  isWhitespace(char)

const isVersionStart = char =>
  (char >= '0' && char <= '9') ||
  char === 'x' ||
  char === 'X' ||
  char === '*'

// Normalize comparator whitespace without running the unanchored
// COMPARATORTRIM regex against the full range.
const trimComparatorWhitespace = range => {
  const removals = []

  for (let versionStart = 0; versionStart < range.length; versionStart++) {
    if (!isVersionStart(range[versionStart])) {
      continue
    }

    let prefixStart = versionStart
    while (prefixStart > 0 && isVersionPrefix(range[prefixStart - 1])) {
      prefixStart--
    }

    let operatorEnd
    if (
      prefixStart > 0 &&
      (range[prefixStart - 1] === '<' || range[prefixStart - 1] === '>')
    ) {
      operatorEnd = prefixStart
      if (range[operatorEnd] === '=') {
        operatorEnd++
      }
    } else {
      operatorEnd = prefixStart
      if (isWhitespace(range[operatorEnd])) {
        operatorEnd++
      }
      if (range[operatorEnd] !== '=') {
        if (
          !isWhitespace(range[prefixStart]) ||
          !isWhitespace(range[prefixStart + 1])
        ) {
          continue
        }
        operatorEnd = prefixStart + 1
      } else {
        operatorEnd++
      }
    }

    if (isWhitespace(range[operatorEnd])) {
      removals.push([operatorEnd, operatorEnd + 1])
    }
  }

  if (!removals.length) {
    return range
  }

  let result = ''
  let position = 0
  for (const [start, end] of removals) {
    result += range.slice(position, start)
    position = end
  }
  return result + range.slice(position)
}

module.exports = trimComparatorWhitespace
