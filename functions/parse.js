const { MAX_LENGTH } = require('../internal/constants')
const SemVer = require('../classes/semver')
const parse = (version, options) => {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

module.exports = parse
