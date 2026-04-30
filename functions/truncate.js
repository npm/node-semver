'use strict'

const SemVer = require('../classes/semver')
const constants = require('../internal/constants')

const truncate = (version, releaseType, options) => {
  // if (typeof (options) === 'string') {
  //   options = undefined
  // }

  if (!constants.RELEASE_TYPES.includes(releaseType)) {
    return null
  }

  try {
    const currentVersion = new SemVer(
      version instanceof SemVer ? version.version : version,
      options
    )

    currentVersion.prerelease = []

    switch (releaseType) {
      case 'major':
        currentVersion.minor = 0
      // eslint-disable-next-line no-fallthrough -- this is intentional fallthrough
      case 'minor':
        currentVersion.patch = 0
    }

    return currentVersion.format()
  } catch (er) {
    return null
  }
}
module.exports = truncate
