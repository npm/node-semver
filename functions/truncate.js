'use strict'

const parse = require('./parse')
const constants = require('../internal/constants')

const _truncate = (version, truncation) => {
  if (truncation.startsWith('pre')) {
    return version.version
  }

  version.prerelease = []

  switch (truncation) {
    case 'major':
      version.minor = 0
      version.patch = 0
      break
    case 'minor':
      version.patch = 0
      break
  }

  return version.format()
}

const truncate = (version, truncation, options) => {
  if (!constants.RELEASE_TYPES.includes(truncation)) {
    return null
  }

  const parsed = parse(version, options)
  return parsed && _truncate(parsed, truncation)
}
module.exports = truncate


// 1. Should truncate _always_ strip off build info?
