'use strict'

const parse = require('./parse')
const constants = require('../internal/constants')

const _truncate = (version, releaseType) => {
  version.prerelease = []

  switch (releaseType) {
    case 'major':
      version.minor = 0
    // eslint-disable-next-line no-fallthrough -- this is intentional fallthrough
    case 'minor':
      version.patch = 0
  }

  return version.format()
}

const truncate = (version, releaseType, options) => {
  if (!constants.RELEASE_TYPES.includes(releaseType)) {
    return null
  }

  const parsed = parse(version, options)
  return parsed && _truncate(parsed, releaseType)
}
module.exports = truncate
